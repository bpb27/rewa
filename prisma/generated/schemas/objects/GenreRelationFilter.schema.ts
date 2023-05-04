import { z } from 'zod';
import { GenreWhereInputObjectSchema } from './GenreWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenreRelationFilter> = z
  .object({
    is: z.lazy(() => GenreWhereInputObjectSchema).optional(),
    isNot: z.lazy(() => GenreWhereInputObjectSchema).optional(),
  })
  .strict();

export const GenreRelationFilterObjectSchema = Schema;
