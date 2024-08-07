import { z } from 'zod';

export const env = z
  .object({
    VITE_POCKETBASE_URL: z.string().url(),
  })
  .parse(import.meta.env);
