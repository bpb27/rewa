import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CrewUncheckedCreateInput> = z
  .object({
    adult: z.boolean(),
    gender: z.number(),
    known_for_department: z.string().optional().nullable(),
    name: z.string(),
    original_name: z.string().optional().nullable(),
    popularity: z.number(),
    profile_path: z.string().optional().nullable(),
    credit_id: z.string(),
    department: z.string().optional().nullable(),
    job: z.string().optional().nullable(),
    movie_id: z.number(),
  })
  .strict();

export const CrewUncheckedCreateInputObjectSchema = Schema;
