import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { CastCountOrderByAggregateInputObjectSchema } from './CastCountOrderByAggregateInput.schema';
import { CastAvgOrderByAggregateInputObjectSchema } from './CastAvgOrderByAggregateInput.schema';
import { CastMaxOrderByAggregateInputObjectSchema } from './CastMaxOrderByAggregateInput.schema';
import { CastMinOrderByAggregateInputObjectSchema } from './CastMinOrderByAggregateInput.schema';
import { CastSumOrderByAggregateInputObjectSchema } from './CastSumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CastOrderByWithAggregationInput> = z
  .object({
    adult: z.lazy(() => SortOrderSchema).optional(),
    gender: z.lazy(() => SortOrderSchema).optional(),
    known_for_department: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    original_name: z.lazy(() => SortOrderSchema).optional(),
    popularity: z.lazy(() => SortOrderSchema).optional(),
    profile_path: z.lazy(() => SortOrderSchema).optional(),
    character: z.lazy(() => SortOrderSchema).optional(),
    credit_id: z.lazy(() => SortOrderSchema).optional(),
    order: z.lazy(() => SortOrderSchema).optional(),
    cast_id: z.lazy(() => SortOrderSchema).optional(),
    movie_id: z.lazy(() => SortOrderSchema).optional(),
    _count: z.lazy(() => CastCountOrderByAggregateInputObjectSchema).optional(),
    _avg: z.lazy(() => CastAvgOrderByAggregateInputObjectSchema).optional(),
    _max: z.lazy(() => CastMaxOrderByAggregateInputObjectSchema).optional(),
    _min: z.lazy(() => CastMinOrderByAggregateInputObjectSchema).optional(),
    _sum: z.lazy(() => CastSumOrderByAggregateInputObjectSchema).optional(),
  })
  .strict();

export const CastOrderByWithAggregationInputObjectSchema = Schema;
