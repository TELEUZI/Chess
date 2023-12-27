import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().regex(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/),
  password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/),
  email: z.string().email(),
});

export type UserSchema = z.infer<typeof userSchema>;
