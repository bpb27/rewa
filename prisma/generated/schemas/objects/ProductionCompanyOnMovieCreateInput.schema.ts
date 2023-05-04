import { z } from 'zod';
import { MovieCreateNestedOneWithoutProduction_companiesInputObjectSchema } from './MovieCreateNestedOneWithoutProduction_companiesInput.schema';
import { ProductionCompanyCreateNestedOneWithoutMoviesInputObjectSchema } from './ProductionCompanyCreateNestedOneWithoutMoviesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieCreateInput> = z
  .object({
    movie: z.lazy(
      () => MovieCreateNestedOneWithoutProduction_companiesInputObjectSchema,
    ),
    productionCompany: z.lazy(
      () => ProductionCompanyCreateNestedOneWithoutMoviesInputObjectSchema,
    ),
  })
  .strict();

export const ProductionCompanyOnMovieCreateInputObjectSchema = Schema;
