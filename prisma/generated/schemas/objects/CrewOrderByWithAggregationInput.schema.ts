import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { CrewCountOrderByAggregateInputObjectSchema } from './CrewCountOrderByAggregateInput.schema';
import { CrewAvgOrderByAggregateInputObjectSchema } from './CrewAvgOrderByAggregateInput.schema';
import { CrewMaxOrderByAggregateInputObjectSchema } from './CrewMaxOrderByAggregateInput.schema';
import { CrewMinOrderByAggregateInputObjectSchema } from './CrewMinOrderByAggregateInput.schema';
import { CrewSumOrderByAggregateInputObjectSchema } from './CrewSumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CrewOrderByWithAggregationInput> = z
  .object({
    adult: z.lazy(() => SortOrderSchema).optional(),
    gender: z.lazy(() => SortOrderSchema).optional(),
    known_for_department: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    original_name: z.lazy(() => SortOrderSchema).optional(),
    popularity: z.lazy(() => SortOrderSchema).optional(),
    profile_path: z.lazy(() => SortOrderSchema).optional(),
    credit_id: z.lazy(() => SortOrderSchema).optional(),
    department: z.lazy(() => SortOrderSchema).optional(),
    job: z.lazy(() => SortOrderSchema).optional(),
    movie_id: z.lazy(() => SortOrderSchema).optional(),
    _count: z.lazy(() => CrewCountOrderByAggregateInputObjectSchema).optional(),
    _avg: z.lazy(() => CrewAvgOrderByAggregateInputObjectSchema).optional(),
    _max: z.lazy(() => CrewMaxOrderByAggregateInputObjectSchema).optional(),
    _min: z.lazy(() => CrewMinOrderByAggregateInputObjectSchema).optional(),
    _sum: z.lazy(() => CrewSumOrderByAggregateInputObjectSchema).optional(),
  })
  .strict();

export const CrewOrderByWithAggregationInputObjectSchema = Schema;
