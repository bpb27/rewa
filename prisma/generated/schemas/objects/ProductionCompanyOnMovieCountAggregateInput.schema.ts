import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieCountAggregateInputType> =
  z
    .object({
      movieId: z.literal(true).optional(),
      productionCompanyId: z.literal(true).optional(),
      _all: z.literal(true).optional(),
    })
    .strict();

export const ProductionCompanyOnMovieCountAggregateInputObjectSchema = Schema;
