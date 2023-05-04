import { z } from 'zod';
import { ProductionCompanyWhereInputObjectSchema } from './ProductionCompanyWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyRelationFilter> = z
  .object({
    is: z.lazy(() => ProductionCompanyWhereInputObjectSchema).optional(),
    isNot: z.lazy(() => ProductionCompanyWhereInputObjectSchema).optional(),
  })
  .strict();

export const ProductionCompanyRelationFilterObjectSchema = Schema;
