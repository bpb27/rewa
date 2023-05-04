import { z } from 'zod';
import { ProductionCompanyOnMovieWhereUniqueInputObjectSchema } from './ProductionCompanyOnMovieWhereUniqueInput.schema';
import { ProductionCompanyOnMovieUpdateWithoutMovieInputObjectSchema } from './ProductionCompanyOnMovieUpdateWithoutMovieInput.schema';
import { ProductionCompanyOnMovieUncheckedUpdateWithoutMovieInputObjectSchema } from './ProductionCompanyOnMovieUncheckedUpdateWithoutMovieInput.schema';
import { ProductionCompanyOnMovieCreateWithoutMovieInputObjectSchema } from './ProductionCompanyOnMovieCreateWithoutMovieInput.schema';
import { ProductionCompanyOnMovieUncheckedCreateWithoutMovieInputObjectSchema } from './ProductionCompanyOnMovieUncheckedCreateWithoutMovieInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieUpsertWithWhereUniqueWithoutMovieInput> =
  z
    .object({
      where: z.lazy(() => ProductionCompanyOnMovieWhereUniqueInputObjectSchema),
      update: z.union([
        z.lazy(
          () => ProductionCompanyOnMovieUpdateWithoutMovieInputObjectSchema,
        ),
        z.lazy(
          () =>
            ProductionCompanyOnMovieUncheckedUpdateWithoutMovieInputObjectSchema,
        ),
      ]),
      create: z.union([
        z.lazy(
          () => ProductionCompanyOnMovieCreateWithoutMovieInputObjectSchema,
        ),
        z.lazy(
          () =>
            ProductionCompanyOnMovieUncheckedCreateWithoutMovieInputObjectSchema,
        ),
      ]),
    })
    .strict();

export const ProductionCompanyOnMovieUpsertWithWhereUniqueWithoutMovieInputObjectSchema =
  Schema;
