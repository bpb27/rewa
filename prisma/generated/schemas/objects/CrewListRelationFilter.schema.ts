import { z } from 'zod';
import { CrewWhereInputObjectSchema } from './CrewWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CrewListRelationFilter> = z
  .object({
    every: z.lazy(() => CrewWhereInputObjectSchema).optional(),
    some: z.lazy(() => CrewWhereInputObjectSchema).optional(),
    none: z.lazy(() => CrewWhereInputObjectSchema).optional(),
  })
  .strict();

export const CrewListRelationFilterObjectSchema = Schema;
