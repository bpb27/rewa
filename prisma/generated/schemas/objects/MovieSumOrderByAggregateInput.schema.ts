import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.MovieSumOrderByAggregateInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    budget: z.lazy(() => SortOrderSchema).optional(),
    popularity: z.lazy(() => SortOrderSchema).optional(),
    revenue: z.lazy(() => SortOrderSchema).optional(),
    runtime: z.lazy(() => SortOrderSchema).optional(),
    vote_average: z.lazy(() => SortOrderSchema).optional(),
    vote_count: z.lazy(() => SortOrderSchema).optional(),
  })
  .strict();

export const MovieSumOrderByAggregateInputObjectSchema = Schema;
