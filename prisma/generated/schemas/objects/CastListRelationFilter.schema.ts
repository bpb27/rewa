import { z } from 'zod';
import { CastWhereInputObjectSchema } from './CastWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CastListRelationFilter> = z
  .object({
    every: z.lazy(() => CastWhereInputObjectSchema).optional(),
    some: z.lazy(() => CastWhereInputObjectSchema).optional(),
    none: z.lazy(() => CastWhereInputObjectSchema).optional(),
  })
  .strict();

export const CastListRelationFilterObjectSchema = Schema;
