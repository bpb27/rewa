import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { GenreCountOrderByAggregateInputObjectSchema } from './GenreCountOrderByAggregateInput.schema';
import { GenreAvgOrderByAggregateInputObjectSchema } from './GenreAvgOrderByAggregateInput.schema';
import { GenreMaxOrderByAggregateInputObjectSchema } from './GenreMaxOrderByAggregateInput.schema';
import { GenreMinOrderByAggregateInputObjectSchema } from './GenreMinOrderByAggregateInput.schema';
import { GenreSumOrderByAggregateInputObjectSchema } from './GenreSumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenreOrderByWithAggregationInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    _count: z
      .lazy(() => GenreCountOrderByAggregateInputObjectSchema)
      .optional(),
    _avg: z.lazy(() => GenreAvgOrderByAggregateInputObjectSchema).optional(),
    _max: z.lazy(() => GenreMaxOrderByAggregateInputObjectSchema).optional(),
    _min: z.lazy(() => GenreMinOrderByAggregateInputObjectSchema).optional(),
    _sum: z.lazy(() => GenreSumOrderByAggregateInputObjectSchema).optional(),
  })
  .strict();

export const GenreOrderByWithAggregationInputObjectSchema = Schema;
