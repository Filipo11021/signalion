import { z } from 'zod';

export const env = z
  .object({
    POCKETBASE_URL: z.string().url().default('http://localhost:7000'),
  })
  .parse(import.meta.env);
