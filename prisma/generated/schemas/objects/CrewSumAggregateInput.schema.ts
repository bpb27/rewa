import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CrewSumAggregateInputType> = z
  .object({
    gender: z.literal(true).optional(),
    popularity: z.literal(true).optional(),
    movie_id: z.literal(true).optional(),
  })
  .strict();

export const CrewSumAggregateInputObjectSchema = Schema;
