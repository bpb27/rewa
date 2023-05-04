import { z } from 'zod';
import { ProductionCompanyOnMovieWhereUniqueInputObjectSchema } from './ProductionCompanyOnMovieWhereUniqueInput.schema';
import { ProductionCompanyOnMovieCreateWithoutMovieInputObjectSchema } from './ProductionCompanyOnMovieCreateWithoutMovieInput.schema';
import { ProductionCompanyOnMovieUncheckedCreateWithoutMovieInputObjectSchema } from './ProductionCompanyOnMovieUncheckedCreateWithoutMovieInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieCreateOrConnectWithoutMovieInput> =
  z
    .object({
      where: z.lazy(() => ProductionCompanyOnMovieWhereUniqueInputObjectSchema),
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

export const ProductionCompanyOnMovieCreateOrConnectWithoutMovieInputObjectSchema =
  Schema;
