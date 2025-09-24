import { PracticeSessionResponse } from '@/dtos';
import createClient from '@/integrations/supabase/api';
import { createCTSPracticeSession } from '@/services/practice-session.service';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(): Promise<
  NextResponse<PracticeSessionResponse | { error: string }>
> {
  const client = await createClient();

  const currentUser = await client.auth.getUser();

  if (!currentUser.data.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // TODO: fetch words based on spaced repetition algorithm
  const words = await client
    .from('words')
    .select('*')
    .eq('user_id', currentUser.data.user.id)
    .limit(5)
    .order('created_at', { ascending: false });

  if (words.error || !words.data) {
    return NextResponse.json(
      { error: 'Error fetching words' },
      { status: 500 },
    );
  }

  const session = await createCTSPracticeSession(
    currentUser.data.user.id,
    words.data.map((w) => ({
      word: w.word,
      wordId: w.id,
    })),
  );

  const dbSession = await client
    .from('practice_sessions')
    .insert({
      user_id: currentUser.data.user.id,
      is_completed: session.isCompleted,
      game_type: session.gameType,
      steps: session.steps,
    })
    .select('*')
    .single();

  if (dbSession.error || !dbSession.data) {
    return NextResponse.json(
      { error: 'Error creating practice session' },
      { status: 500 },
    );
  }

  return NextResponse.json({
    id: dbSession.data.id,
    gameType: session.gameType,
    isCompleted: session.isCompleted,
    steps: session.steps,
  });
}
