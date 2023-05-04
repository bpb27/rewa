import { z } from 'zod';
import { ProductionCompanyOnMovieWhereInputObjectSchema } from './ProductionCompanyOnMovieWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieListRelationFilter> = z
  .object({
    every: z
      .lazy(() => ProductionCompanyOnMovieWhereInputObjectSchema)
      .optional(),
    some: z
      .lazy(() => ProductionCompanyOnMovieWhereInputObjectSchema)
      .optional(),
    none: z
      .lazy(() => ProductionCompanyOnMovieWhereInputObjectSchema)
      .optional(),
  })
  .strict();

export const ProductionCompanyOnMovieListRelationFilterObjectSchema = Schema;
