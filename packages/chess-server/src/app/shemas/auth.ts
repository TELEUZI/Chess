import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const refreshTokenSchema = z.object({
  token: z.string(),
});

export type RefreshTokenSchema = z.infer<typeof refreshTokenSchema>;

export const registerSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
