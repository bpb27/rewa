import { z } from 'zod';
import { MovieCreateNestedOneWithoutCastInputObjectSchema } from './MovieCreateNestedOneWithoutCastInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CastCreateInput> = z
  .object({
    adult: z.boolean(),
    gender: z.number(),
    known_for_department: z.string().optional().nullable(),
    name: z.string(),
    original_name: z.string().optional().nullable(),
    popularity: z.number(),
    profile_path: z.string().optional().nullable(),
    character: z.string().optional().nullable(),
    credit_id: z.string(),
    order: z.number().optional().nullable(),
    cast_id: z.number().optional().nullable(),
    Movie: z.lazy(() => MovieCreateNestedOneWithoutCastInputObjectSchema),
  })
  .strict();

export const CastCreateInputObjectSchema = Schema;
