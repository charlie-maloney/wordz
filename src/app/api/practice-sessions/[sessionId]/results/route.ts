import {
  PracticeSessionResultRequestSchema,
  PracticeSessionResultResponse,
} from '@/dtos';
import createClient from '@/integrations/supabase/api';
import { scoreCTSSession } from '@/services/practice-session.service';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  context: { params: { sessionId: string } },
): Promise<NextResponse<PracticeSessionResultResponse | { error: string }>> {
  const client = await createClient();
  const { sessionId } = await context.params;

  const currentUser = await client.auth.getUser();

  if (!currentUser.data.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await req.json();
  const validatedBody =
    await PracticeSessionResultRequestSchema.parseAsync(body);

  const session = await client
    .from('practice_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', currentUser.data.user.id)
    .single();

  if (session.error || !session.data) {
    return NextResponse.json(
      { error: 'Practice session not found' },
      { status: 404 },
    );
  }

  // Score the session and get the score deltas for each word
  const scores = scoreCTSSession(session.data, validatedBody);

  const previousResults = await client
    .from('practice_session_results')
    .select('*')
    .eq('session_id', sessionId);

  // filter out any scores that have already been recorded
  const newScores = scores.filter(
    (score) =>
      !previousResults.data?.some(
        (result) =>
          result.step_id === score.stepId && result.word_id === score.wordId,
      ),
  );

  const { error } = await client.from('practice_session_results').upsert(
    newScores.map((score) => ({
      step_id: score.stepId,
      word_id: score.wordId,
      correct: score.scoreDelta > 0,
      session_id: sessionId,
      score_delta: score.scoreDelta,
    })),
  );
  if (error) {
    console.error('Upsert error:', error);
  }

  // compile total score delta for each word
  const wordScoreMap: Record<string, number> = {};
  newScores.forEach((score) => {
    if (!wordScoreMap[score.wordId]) {
      wordScoreMap[score.wordId] = 0;
    }
    wordScoreMap[score.wordId] += score.scoreDelta;
  });

  console.log('Word Score Map:', wordScoreMap);

  // get words from the database
  const words = await client
    .from('words')
    .select('*')
    .eq('user_id', currentUser.data.user.id)
    .in('id', Object.keys(wordScoreMap));

  if (words.error || !words.data) {
    return NextResponse.json(
      { error: 'Error fetching words' },
      { status: 500 },
    );
  }

  console.log('Words fetched from database:', words);

  // update word scores
  await Promise.all(
    words.data.map((word) => {
      const scoreDelta = wordScoreMap[word.id] || 0;
      console.log(
        `Updating word ${word.word} (ID: ${word.id}) with score delta ${scoreDelta}`,
      );
      return client
        .from('words')
        .update({
          score: word.score + scoreDelta,
        })
        .eq('id', word.id);
    }),
  ).catch((error) => {
    console.error('Error in Promise.all:', error);
  });

  // mark session as completed
  const updatedSession = await client
    .from('practice_sessions')
    .update({ is_completed: true })
    .eq('id', sessionId)
    .select('*')
    .single();

  if (updatedSession.error || !updatedSession.data) {
    return NextResponse.json(
      { error: 'Error updating practice session' },
      { status: 500 },
    );
  }

  return NextResponse.json({
    sessionId: updatedSession.data.id,
    gameType: updatedSession.data.game_type,
    isCompleted: updatedSession.data.is_completed || false,
    totalSteps: ((session.data.steps as []) || []).length,
    correctSteps: scores.filter((s) => s.scoreDelta > 0).length,
    scoreGained: newScores.reduce((acc, score) => acc + score.scoreDelta, 0),
    words: words.data.map((w) => w.word),
  });
}
