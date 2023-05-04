import { z } from 'zod';
import { MovieUpdateOneRequiredWithoutProduction_companiesNestedInputObjectSchema } from './MovieUpdateOneRequiredWithoutProduction_companiesNestedInput.schema';
import { ProductionCompanyUpdateOneRequiredWithoutMoviesNestedInputObjectSchema } from './ProductionCompanyUpdateOneRequiredWithoutMoviesNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieUpdateInput> = z
  .object({
    movie: z
      .lazy(
        () =>
          MovieUpdateOneRequiredWithoutProduction_companiesNestedInputObjectSchema,
      )
      .optional(),
    productionCompany: z
      .lazy(
        () =>
          ProductionCompanyUpdateOneRequiredWithoutMoviesNestedInputObjectSchema,
      )
      .optional(),
  })
  .strict();

export const ProductionCompanyOnMovieUpdateInputObjectSchema = Schema;
