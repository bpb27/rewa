import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { ProductionCompanyCountOrderByAggregateInputObjectSchema } from './ProductionCompanyCountOrderByAggregateInput.schema';
import { ProductionCompanyAvgOrderByAggregateInputObjectSchema } from './ProductionCompanyAvgOrderByAggregateInput.schema';
import { ProductionCompanyMaxOrderByAggregateInputObjectSchema } from './ProductionCompanyMaxOrderByAggregateInput.schema';
import { ProductionCompanyMinOrderByAggregateInputObjectSchema } from './ProductionCompanyMinOrderByAggregateInput.schema';
import { ProductionCompanySumOrderByAggregateInputObjectSchema } from './ProductionCompanySumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOrderByWithAggregationInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    logo_path: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    origin_country: z.lazy(() => SortOrderSchema).optional(),
    _count: z
      .lazy(() => ProductionCompanyCountOrderByAggregateInputObjectSchema)
      .optional(),
    _avg: z
      .lazy(() => ProductionCompanyAvgOrderByAggregateInputObjectSchema)
      .optional(),
    _max: z
      .lazy(() => ProductionCompanyMaxOrderByAggregateInputObjectSchema)
      .optional(),
    _min: z
      .lazy(() => ProductionCompanyMinOrderByAggregateInputObjectSchema)
      .optional(),
    _sum: z
      .lazy(() => ProductionCompanySumOrderByAggregateInputObjectSchema)
      .optional(),
  })
  .strict();

export const ProductionCompanyOrderByWithAggregationInputObjectSchema = Schema;
