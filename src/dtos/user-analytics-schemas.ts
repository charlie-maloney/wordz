import { z } from 'zod';

// User Analytics Response Schema
export const UserAnalyticsResponseSchema = z.object({
  totalWords: z.number().int().nonnegative(),
  totalPracticedWords: z.number().int().nonnegative(),
  totalPracticeSessions: z.number().int().nonnegative(),
  averageScorePerSession: z.number(),
  wordsAddedLast7Days: z.number().int().nonnegative(),
  wordsPracticedLast7Days: z.number().int().nonnegative(),
});

// Inferred Types
export type UserAnalyticsResponse = z.infer<typeof UserAnalyticsResponseSchema>;
