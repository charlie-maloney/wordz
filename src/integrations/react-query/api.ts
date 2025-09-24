import { Session } from '@supabase/supabase-js';
import { createClient } from '../supabase/browser';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  AddWordRequest,
  ListWordsResponse,
  PracticeSessionResponse,
  WordResponse,
} from '@/dtos';
import { queryClient } from './provider';

let inFlightEnsure: Promise<Session | null> | null = null;

const supabase = createClient();

export async function ensureAuthSession(): Promise<Session | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) return session;

  // coalesce concurrent calls
  if (!inFlightEnsure) {
    inFlightEnsure = (async () => {
      const { data, error } = await supabase.auth.signInAnonymously();
      inFlightEnsure = null;
      if (error) throw error;
      return data.session;
    })();
  }
  return inFlightEnsure;
}

export const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(async (config) => {
  await ensureAuthSession();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers = config.headers ?? {};
    (config.headers as { Authorization: string }).Authorization =
      `Bearer ${session.access_token}`;
  }
  return config;
});

export const useListWordsQuery = () =>
  useQuery<ListWordsResponse, Error, ListWordsResponse>({
    queryKey: ['words'],
    queryFn: () =>
      api.get('/words').then((r) => {
        return r.data;
      }),
  });

export const useAddWordMutation = () => {
  return useMutation<WordResponse, Error, AddWordRequest>({
    mutationFn: (newWord: AddWordRequest) =>
      api.post('/words', newWord).then((r) => r.data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['words'] });
    },
  });
};

export const useProfileQueryQuery = () =>
  useQuery({
    queryKey: ['profile'],
    queryFn: () =>
      api.get('/profile/me').then((r) => {
        return r.data;
      }),
  });

export const useCreatePracticeSessionMutation = () => {
  return useMutation<PracticeSessionResponse, Error, void>({
    mutationFn: () => api.post('/practice-sessions').then((r) => r.data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['practice-sessions'] });
    },
  });
};
