import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieSumAggregateInputType> = z
  .object({
    movieId: z.literal(true).optional(),
    genreId: z.literal(true).optional(),
  })
  .strict();

export const GenresOnMovieSumAggregateInputObjectSchema = Schema;
