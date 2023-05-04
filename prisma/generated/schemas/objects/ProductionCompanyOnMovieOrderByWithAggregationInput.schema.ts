import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { ProductionCompanyOnMovieCountOrderByAggregateInputObjectSchema } from './ProductionCompanyOnMovieCountOrderByAggregateInput.schema';
import { ProductionCompanyOnMovieAvgOrderByAggregateInputObjectSchema } from './ProductionCompanyOnMovieAvgOrderByAggregateInput.schema';
import { ProductionCompanyOnMovieMaxOrderByAggregateInputObjectSchema } from './ProductionCompanyOnMovieMaxOrderByAggregateInput.schema';
import { ProductionCompanyOnMovieMinOrderByAggregateInputObjectSchema } from './ProductionCompanyOnMovieMinOrderByAggregateInput.schema';
import { ProductionCompanyOnMovieSumOrderByAggregateInputObjectSchema } from './ProductionCompanyOnMovieSumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieOrderByWithAggregationInput> =
  z
    .object({
      movieId: z.lazy(() => SortOrderSchema).optional(),
      productionCompanyId: z.lazy(() => SortOrderSchema).optional(),
      _count: z
        .lazy(
          () => ProductionCompanyOnMovieCountOrderByAggregateInputObjectSchema,
        )
        .optional(),
      _avg: z
        .lazy(
          () => ProductionCompanyOnMovieAvgOrderByAggregateInputObjectSchema,
        )
        .optional(),
      _max: z
        .lazy(
          () => ProductionCompanyOnMovieMaxOrderByAggregateInputObjectSchema,
        )
        .optional(),
      _min: z
        .lazy(
          () => ProductionCompanyOnMovieMinOrderByAggregateInputObjectSchema,
        )
        .optional(),
      _sum: z
        .lazy(
          () => ProductionCompanyOnMovieSumOrderByAggregateInputObjectSchema,
        )
        .optional(),
    })
    .strict();

export const ProductionCompanyOnMovieOrderByWithAggregationInputObjectSchema =
  Schema;
