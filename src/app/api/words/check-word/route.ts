import { CheckAddWordRequestSchema, CheckAddWordResponse } from '@/dtos';
import { DictionaryResponse } from '@/dtos/dictionary';
import createClient from '@/integrations/supabase/api';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
): Promise<NextResponse<CheckAddWordResponse | { error: string }>> {
  const client = await createClient();

  const currentUser = await client.auth.getUser();

  if (!currentUser.data.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await req.json();
  const validatedBody = await CheckAddWordRequestSchema.parseAsync(body);
  const { word } = validatedBody;

  const { error, data } = await client
    .from('words')
    .select('id')
    .eq('user_id', currentUser.data.user.id)
    .eq('word', word)
    .select()
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to check word' },
      { status: 500 },
    );
  }

  if (data) {
    return NextResponse.json({
      alreadyExists: true,
      word: data.word,
    });
  }

  const fetchedWord = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
      word,
    )}`,
  );

  if (!fetchedWord.ok) {
    console.log('Fetched word not ok:', fetchedWord.statusText);
    if (fetchedWord.status === 404) {
      return NextResponse.json(
        { error: `Word (${word}) not found in dictionary` },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch word definition' },
      { status: 500 },
    );
  }

  const fetchedData: DictionaryResponse = await fetchedWord.json();

  if (!Array.isArray(fetchedData) || fetchedData.length === 0) {
    return NextResponse.json(
      { error: `Word (${word}) not found in dictionary` },
      { status: 404 },
    );
  }

  const definition =
    fetchedData[0]?.meanings?.[0]?.definitions?.[0]?.definition || '';

  return NextResponse.json({
    alreadyExists: false,
    word: word,
    definition,
  });
}
