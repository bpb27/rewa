import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CastMaxAggregateInputType> = z
  .object({
    adult: z.literal(true).optional(),
    gender: z.literal(true).optional(),
    known_for_department: z.literal(true).optional(),
    name: z.literal(true).optional(),
    original_name: z.literal(true).optional(),
    popularity: z.literal(true).optional(),
    profile_path: z.literal(true).optional(),
    character: z.literal(true).optional(),
    credit_id: z.literal(true).optional(),
    order: z.literal(true).optional(),
    cast_id: z.literal(true).optional(),
    movie_id: z.literal(true).optional(),
  })
  .strict();

export const CastMaxAggregateInputObjectSchema = Schema;
