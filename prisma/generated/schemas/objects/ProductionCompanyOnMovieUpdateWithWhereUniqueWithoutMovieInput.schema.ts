import { z } from 'zod';
import { ProductionCompanyOnMovieWhereUniqueInputObjectSchema } from './ProductionCompanyOnMovieWhereUniqueInput.schema';
import { ProductionCompanyOnMovieUpdateWithoutMovieInputObjectSchema } from './ProductionCompanyOnMovieUpdateWithoutMovieInput.schema';
import { ProductionCompanyOnMovieUncheckedUpdateWithoutMovieInputObjectSchema } from './ProductionCompanyOnMovieUncheckedUpdateWithoutMovieInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieUpdateWithWhereUniqueWithoutMovieInput> =
  z
    .object({
      where: z.lazy(() => ProductionCompanyOnMovieWhereUniqueInputObjectSchema),
      data: z.union([
        z.lazy(
          () => ProductionCompanyOnMovieUpdateWithoutMovieInputObjectSchema,
        ),
        z.lazy(
          () =>
            ProductionCompanyOnMovieUncheckedUpdateWithoutMovieInputObjectSchema,
        ),
      ]),
    })
    .strict();

export const ProductionCompanyOnMovieUpdateWithWhereUniqueWithoutMovieInputObjectSchema =
  Schema;
