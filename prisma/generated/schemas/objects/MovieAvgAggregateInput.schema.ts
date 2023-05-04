import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.MovieAvgAggregateInputType> = z
  .object({
    id: z.literal(true).optional(),
    budget: z.literal(true).optional(),
    popularity: z.literal(true).optional(),
    revenue: z.literal(true).optional(),
    runtime: z.literal(true).optional(),
    vote_average: z.literal(true).optional(),
    vote_count: z.literal(true).optional(),
  })
  .strict();

export const MovieAvgAggregateInputObjectSchema = Schema;
