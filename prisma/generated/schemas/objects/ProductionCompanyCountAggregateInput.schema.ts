import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyCountAggregateInputType> = z
  .object({
    id: z.literal(true).optional(),
    logo_path: z.literal(true).optional(),
    name: z.literal(true).optional(),
    origin_country: z.literal(true).optional(),
    _all: z.literal(true).optional(),
  })
  .strict();

export const ProductionCompanyCountAggregateInputObjectSchema = Schema;
