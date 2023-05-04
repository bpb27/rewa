import { z } from 'zod';
import { MovieUpdateOneRequiredWithoutProduction_companiesNestedInputObjectSchema } from './MovieUpdateOneRequiredWithoutProduction_companiesNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieUpdateWithoutProductionCompanyInput> =
  z
    .object({
      movie: z
        .lazy(
          () =>
            MovieUpdateOneRequiredWithoutProduction_companiesNestedInputObjectSchema,
        )
        .optional(),
    })
    .strict();

export const ProductionCompanyOnMovieUpdateWithoutProductionCompanyInputObjectSchema =
  Schema;
