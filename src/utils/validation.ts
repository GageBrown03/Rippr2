import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be at most 20 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const openPackSchema = z.object({
  packId: z.string().min(1, 'Pack ID is required'),
  quantity: z.number().int().min(1, 'Minimum 1 pack').max(10, 'Maximum 10 packs'),
});

export const showcaseSchema = z.object({
  userCardId: z.string().min(1, 'UserCard ID is required'),
  showcase: z.boolean(),
});

export const collectionQuerySchema = z.object({
  rarity: z.string().optional(),
  type: z.string().optional(),
  setName: z.string().optional(),
  sortBy: z.enum(['newest', 'rarest', 'alphabetical']).optional().default('newest'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(1000).optional().default(100),
});
