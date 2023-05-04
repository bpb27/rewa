import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieAvgAggregateInputType> = z
  .object({
    movieId: z.literal(true).optional(),
    genreId: z.literal(true).optional(),
  })
  .strict();

export const GenresOnMovieAvgAggregateInputObjectSchema = Schema;
