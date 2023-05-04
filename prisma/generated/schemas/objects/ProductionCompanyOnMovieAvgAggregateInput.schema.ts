import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieAvgAggregateInputType> =
  z
    .object({
      movieId: z.literal(true).optional(),
      productionCompanyId: z.literal(true).optional(),
    })
    .strict();

export const ProductionCompanyOnMovieAvgAggregateInputObjectSchema = Schema;
