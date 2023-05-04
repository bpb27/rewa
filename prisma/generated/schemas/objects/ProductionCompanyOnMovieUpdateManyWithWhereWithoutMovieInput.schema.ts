import { z } from 'zod';
import { ProductionCompanyOnMovieScalarWhereInputObjectSchema } from './ProductionCompanyOnMovieScalarWhereInput.schema';
import { ProductionCompanyOnMovieUpdateManyMutationInputObjectSchema } from './ProductionCompanyOnMovieUpdateManyMutationInput.schema';
import { ProductionCompanyOnMovieUncheckedUpdateManyWithoutProduction_companiesInputObjectSchema } from './ProductionCompanyOnMovieUncheckedUpdateManyWithoutProduction_companiesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieUpdateManyWithWhereWithoutMovieInput> =
  z
    .object({
      where: z.lazy(() => ProductionCompanyOnMovieScalarWhereInputObjectSchema),
      data: z.union([
        z.lazy(
          () => ProductionCompanyOnMovieUpdateManyMutationInputObjectSchema,
        ),
        z.lazy(
          () =>
            ProductionCompanyOnMovieUncheckedUpdateManyWithoutProduction_companiesInputObjectSchema,
        ),
      ]),
    })
    .strict();

export const ProductionCompanyOnMovieUpdateManyWithWhereWithoutMovieInputObjectSchema =
  Schema;
