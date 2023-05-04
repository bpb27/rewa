import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CastSumAggregateInputType> = z
  .object({
    gender: z.literal(true).optional(),
    popularity: z.literal(true).optional(),
    order: z.literal(true).optional(),
    cast_id: z.literal(true).optional(),
    movie_id: z.literal(true).optional(),
  })
  .strict();

export const CastSumAggregateInputObjectSchema = Schema;
