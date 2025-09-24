import {
  AddWordRequestSchema,
  ListWordsRequestSchema,
  ListWordsResponse,
  WordResponse,
} from '@/dtos';
import createClient from '@/integrations/supabase/api';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// POST /api/words - Add a new word for the authenticated user
export async function POST(
  req: NextRequest,
): Promise<NextResponse<WordResponse | { error: string }>> {
  const client = await createClient();

  const currentUser = await client.auth.getUser();

  if (!currentUser.data.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await req.json();
  const validatedBody = await AddWordRequestSchema.parseAsync(body);

  const { error, data } = await client
    .from('words')
    .insert({
      word: validatedBody.word.toLowerCase(),
      user_id: currentUser.data.user.id,
    })
    .select()
    .single();

  if (error || !data) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to insert word' },
      { status: 500 },
    );
  }

  return NextResponse.json({
    id: data.id,
    word: validatedBody.word.toLowerCase(),
    addedOn: data.created_at,
    // TODO: update when implementing practice sessions
    lastPracticedOn: new Date(0).toISOString(),
    score: data.score,
  });
}

// GET /api/words - List words for the authenticated user
export async function GET(
  req: NextRequest,
): Promise<NextResponse<ListWordsResponse | { error: string }>> {
  const client = await createClient();

  const currentUser = await client.auth.getUser();

  if (!currentUser.data.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const queryParams = req.nextUrl.searchParams;
  const validatedBody = await ListWordsRequestSchema.parseAsync(queryParams);
  const { page, limit } = validatedBody;

  const { error, data, count } = await client
    .from('words')
    .select('*', { count: 'exact' })
    .eq('user_id', currentUser.data.user.id)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error || !data) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch words' },
      { status: 500 },
    );
  }

  const words: WordResponse[] = data.map((word) => ({
    id: word.id,
    word: word.word,
    score: word.score,
    addedOn: word.created_at,
    // TODO: update when implementing practice sessions
    lastPracticedOn: new Date(0).toISOString(),
  }));

  return NextResponse.json({
    data: words,
    totalItems: count || 0,
    currentPage: page,
    pageCount: Math.ceil((count || 0) / limit),
  });
}
