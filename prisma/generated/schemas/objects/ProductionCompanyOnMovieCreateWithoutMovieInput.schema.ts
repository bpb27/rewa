import { z } from 'zod';
import { ProductionCompanyCreateNestedOneWithoutMoviesInputObjectSchema } from './ProductionCompanyCreateNestedOneWithoutMoviesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieCreateWithoutMovieInput> =
  z
    .object({
      productionCompany: z.lazy(
        () => ProductionCompanyCreateNestedOneWithoutMoviesInputObjectSchema,
      ),
    })
    .strict();

export const ProductionCompanyOnMovieCreateWithoutMovieInputObjectSchema =
  Schema;
