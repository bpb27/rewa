import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CastWhereUniqueInput> = z
  .object({
    credit_id: z.string().optional(),
  })
  .strict();

export const CastWhereUniqueInputObjectSchema = Schema;
