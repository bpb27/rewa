import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { MovieOrderByWithRelationInputObjectSchema } from './MovieOrderByWithRelationInput.schema';
import { ProductionCompanyOrderByWithRelationInputObjectSchema } from './ProductionCompanyOrderByWithRelationInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieOrderByWithRelationInput> =
  z
    .object({
      movieId: z.lazy(() => SortOrderSchema).optional(),
      productionCompanyId: z.lazy(() => SortOrderSchema).optional(),
      movie: z.lazy(() => MovieOrderByWithRelationInputObjectSchema).optional(),
      productionCompany: z
        .lazy(() => ProductionCompanyOrderByWithRelationInputObjectSchema)
        .optional(),
    })
    .strict();

export const ProductionCompanyOnMovieOrderByWithRelationInputObjectSchema =
  Schema;
