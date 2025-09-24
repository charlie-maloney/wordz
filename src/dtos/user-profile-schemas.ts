import { z } from 'zod';

// User Profile Response Schema
export const UserProfileResponseSchema = z.object({
  id: z.string(),
  email: z.email().nullable(),
  name: z.string(),
  createdOn: z.iso.datetime(),
  lastLogin: z.iso.datetime().nullable(),
  isDeleted: z.boolean(),
  isAnonymous: z.boolean(),
});

// Inferred Types
export type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>;
