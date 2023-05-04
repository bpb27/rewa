import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieMinAggregateInputType> = z
  .object({
    movieId: z.literal(true).optional(),
    genreId: z.literal(true).optional(),
  })
  .strict();

export const GenresOnMovieMinAggregateInputObjectSchema = Schema;
