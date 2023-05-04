import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CrewWhereUniqueInput> = z
  .object({
    credit_id: z.string().optional(),
  })
  .strict();

export const CrewWhereUniqueInputObjectSchema = Schema;
