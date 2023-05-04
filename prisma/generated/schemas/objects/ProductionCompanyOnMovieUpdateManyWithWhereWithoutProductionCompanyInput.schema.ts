import { z } from 'zod';
import { ProductionCompanyOnMovieScalarWhereInputObjectSchema } from './ProductionCompanyOnMovieScalarWhereInput.schema';
import { ProductionCompanyOnMovieUpdateManyMutationInputObjectSchema } from './ProductionCompanyOnMovieUpdateManyMutationInput.schema';
import { ProductionCompanyOnMovieUncheckedUpdateManyWithoutMoviesInputObjectSchema } from './ProductionCompanyOnMovieUncheckedUpdateManyWithoutMoviesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieUpdateManyWithWhereWithoutProductionCompanyInput> =
  z
    .object({
      where: z.lazy(() => ProductionCompanyOnMovieScalarWhereInputObjectSchema),
      data: z.union([
        z.lazy(
          () => ProductionCompanyOnMovieUpdateManyMutationInputObjectSchema,
        ),
        z.lazy(
          () =>
            ProductionCompanyOnMovieUncheckedUpdateManyWithoutMoviesInputObjectSchema,
        ),
      ]),
    })
    .strict();

export const ProductionCompanyOnMovieUpdateManyWithWhereWithoutProductionCompanyInputObjectSchema =
  Schema;
