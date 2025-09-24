import { z } from 'zod';

// Enums
export const GameTypeSchema = z.enum(['ChooseTheSentence']);

// CTS (Choose The Sentence) Schemas
export const CTSOptionSchema = z.object({
  sentence: z.string(),
  isCorrect: z.boolean(),
  keyWord: z.string(),
});

export const CTSStepSchema = z.object({
  id: z.string(),
  wordId: z.string(),
  stepNumber: z.number().int().positive(),
  word: z.string(),
  options: z.array(CTSOptionSchema),
});

// Practice Session Request Schema
export const PracticeSessionRequestSchema = z.object({
  filters: z.array(z.unknown()),
});

// Practice Session Response Schema
export const PracticeSessionResponseSchema = z.object({
  id: z.string(),
  isCompleted: z.boolean(),
  gameType: GameTypeSchema,
  steps: z.array(CTSStepSchema),
});

// Practice Session Result Schemas
export const PracticeSessionResultRequestSchema = z.object({
  steps: z.array(
    z.object({
      id: z.string(),
      correct: z.boolean(),
    }),
  ),
});

export const PracticeSessionResultResponseSchema = z.object({
  sessionId: z.string(),
  totalSteps: z.number().int().nonnegative(),
  isCompleted: z.boolean(),
  correctSteps: z.number().int().nonnegative(),
  scoreGained: z.number(),
  words: z.array(z.string()),
});

// Inferred Types
export type GameType = z.infer<typeof GameTypeSchema>;
export type CTSOption = z.infer<typeof CTSOptionSchema>;
export type CTSStep = z.infer<typeof CTSStepSchema>;
export type PracticeSessionRequest = z.infer<
  typeof PracticeSessionRequestSchema
>;
export type PracticeSessionResponse = z.infer<
  typeof PracticeSessionResponseSchema
>;
export type PracticeSessionResultRequest = z.infer<
  typeof PracticeSessionResultRequestSchema
>;
export type PracticeSessionResultResponse = z.infer<
  typeof PracticeSessionResultResponseSchema
>;
