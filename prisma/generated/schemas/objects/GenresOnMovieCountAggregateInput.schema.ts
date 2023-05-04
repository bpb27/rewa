import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieCountAggregateInputType> = z
  .object({
    movieId: z.literal(true).optional(),
    genreId: z.literal(true).optional(),
    _all: z.literal(true).optional(),
  })
  .strict();

export const GenresOnMovieCountAggregateInputObjectSchema = Schema;
