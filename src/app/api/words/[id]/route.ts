import { WordResponse } from '@/dtos';
import createClient from '@/integrations/supabase/api';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function DELETE(
  _req: NextRequest,
  context: { params: { id: string } },
) {
  const client = await createClient();

  const currentUser = await client.auth.getUser();

  const { id } = await context.params;

  if (!currentUser.data.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { error } = await client
    .from('words')
    .update({ is_deleted: true })
    .eq('id', id)
    .eq('user_id', currentUser.data.user.id);

  if (error) {
    return NextResponse.json({ error: 'Error deleting word' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function GET(
  req: NextRequest,
  context: { params: { id: string } },
): Promise<NextResponse<WordResponse | { error: string }>> {
  const client = await createClient();

  const { id } = await context.params;

  const currentUser = await client.auth.getUser();

  if (!currentUser.data.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const word = await client
    .from('words')
    .select()
    .eq('id', id)
    .eq('user_id', currentUser.data.user.id)
    .single();

  if (word.error || !word.data) {
    return NextResponse.json({ error: 'Word not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: word.data.id,
    word: word.data.word,
    score: word.data.score,
    createdAt: word.data.created_at,
    addedOn: word.data.added_on,
    // TODO: implement last practiced on
    lastPracticedOn: new Date(0).toISOString(),
  });
}
