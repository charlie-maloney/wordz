import { UserProfileResponse } from '@/dtos';
import createClient from '@/integrations/supabase/api';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<
  NextResponse<UserProfileResponse | { error: string }>
> {
  const client = await createClient();

  const currentUser = await client.auth.getUser();

  if (!currentUser.data.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const profile = await client
    .from('user_profiles')
    .select('*')
    .eq('user_id', currentUser.data.user.id)
    .single();

  if (profile.error && profile.error.code !== 'PGRST116') {
    console.error('Database error:', profile.error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 },
    );
  }

  if (profile.data && profile.data.is_deleted) {
    return NextResponse.json(
      { error: 'User profile is deleted' },
      { status: 404 },
    );
  }

  return NextResponse.json({
    id: currentUser.data.user.id,
    email: currentUser.data.user.email || null,
    createdOn: currentUser.data.user.created_at,
    isDeleted: false,
    lastLogin: currentUser.data.user.last_sign_in_at || null,
    name: profile.data?.name || '',
    isAnonymous: !!currentUser.data.user.is_anonymous,
  });
}
