import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenreCreateWithoutMoviesInput> = z
  .object({
    id: z.number(),
    name: z.string(),
  })
  .strict();

export const GenreCreateWithoutMoviesInputObjectSchema = Schema;
