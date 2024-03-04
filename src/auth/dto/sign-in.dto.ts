import { z } from 'zod';

export const signInSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .required();

export type SignInDto = z.infer<typeof signInSchema>;
