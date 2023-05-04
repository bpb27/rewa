import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieSumAggregateInputType> =
  z
    .object({
      movieId: z.literal(true).optional(),
      productionCompanyId: z.literal(true).optional(),
    })
    .strict();

export const ProductionCompanyOnMovieSumAggregateInputObjectSchema = Schema;
