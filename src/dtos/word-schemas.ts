import { z } from 'zod';

// Check Word Schemas
export const CheckAddWordRequestSchema = z.object({
  word: z.string().min(1, 'Word is required'),
});

export const CheckAddWordResponseSchema = z.object({
  word: z.string(),
  alreadyExists: z.boolean(),
});

// Add Word Schemas
export const AddWordRequestSchema = z.object({
  word: z.string().min(1, 'Word is required'),
});

// Word DTO Schema
export const WordSchema = z.object({
  id: z.string(),
  word: z.string(),
  score: z.number(),
  addedOn: z.iso.datetime(),
  lastPracticedOn: z.iso.datetime().nullable(),
});

// List Words Schemas
export const ListWordsRequestSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(50),
});

export const ListWordsResponseSchema = z.object({
  data: z.array(WordSchema),
  totalItems: z.number().int().nonnegative(),
  pageCount: z.number().int().nonnegative(),
  currentPage: z.number().int().positive(),
});

// Inferred Types
export type CheckAddWordRequest = z.infer<typeof CheckAddWordRequestSchema>;
export type CheckAddWordResponse = z.infer<typeof CheckAddWordResponseSchema>;
export type AddWordRequest = z.infer<typeof AddWordRequestSchema>;
export type WordResponse = z.infer<typeof WordSchema>;
export type ListWordsRequest = z.infer<typeof ListWordsRequestSchema>;
export type ListWordsResponse = z.infer<typeof ListWordsResponseSchema>;
