import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieAvgOrderByAggregateInput> =
  z
    .object({
      movieId: z.lazy(() => SortOrderSchema).optional(),
      productionCompanyId: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const ProductionCompanyOnMovieAvgOrderByAggregateInputObjectSchema =
  Schema;
