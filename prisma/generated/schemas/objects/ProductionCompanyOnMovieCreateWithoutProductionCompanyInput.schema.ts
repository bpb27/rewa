import { z } from 'zod';
import { MovieCreateNestedOneWithoutProduction_companiesInputObjectSchema } from './MovieCreateNestedOneWithoutProduction_companiesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieCreateWithoutProductionCompanyInput> =
  z
    .object({
      movie: z.lazy(
        () => MovieCreateNestedOneWithoutProduction_companiesInputObjectSchema,
      ),
    })
    .strict();

export const ProductionCompanyOnMovieCreateWithoutProductionCompanyInputObjectSchema =
  Schema;
