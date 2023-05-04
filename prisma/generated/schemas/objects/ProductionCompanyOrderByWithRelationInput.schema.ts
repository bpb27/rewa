import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { ProductionCompanyOnMovieOrderByRelationAggregateInputObjectSchema } from './ProductionCompanyOnMovieOrderByRelationAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOrderByWithRelationInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    logo_path: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    origin_country: z.lazy(() => SortOrderSchema).optional(),
    movies: z
      .lazy(
        () => ProductionCompanyOnMovieOrderByRelationAggregateInputObjectSchema,
      )
      .optional(),
  })
  .strict();

export const ProductionCompanyOrderByWithRelationInputObjectSchema = Schema;
