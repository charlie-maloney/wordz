import { WordResponse } from '@/dtos';
import createClient from '@/integrations/supabase/api';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(): Promise<
  NextResponse<WordResponse | { error: string }>
> {
  const client = await createClient();

  const currentUser = await client.auth.getUser();

  if (!currentUser.data.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}
