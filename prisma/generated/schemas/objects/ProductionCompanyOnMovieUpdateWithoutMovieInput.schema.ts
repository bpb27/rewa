import { z } from 'zod';
import { ProductionCompanyUpdateOneRequiredWithoutMoviesNestedInputObjectSchema } from './ProductionCompanyUpdateOneRequiredWithoutMoviesNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieUpdateWithoutMovieInput> =
  z
    .object({
      productionCompany: z
        .lazy(
          () =>
            ProductionCompanyUpdateOneRequiredWithoutMoviesNestedInputObjectSchema,
        )
        .optional(),
    })
    .strict();

export const ProductionCompanyOnMovieUpdateWithoutMovieInputObjectSchema =
  Schema;
