import { z } from 'zod';
import { ProductionCompanyOnMovieCreateWithoutMovieInputObjectSchema } from './ProductionCompanyOnMovieCreateWithoutMovieInput.schema';
import { ProductionCompanyOnMovieUncheckedCreateWithoutMovieInputObjectSchema } from './ProductionCompanyOnMovieUncheckedCreateWithoutMovieInput.schema';
import { ProductionCompanyOnMovieCreateOrConnectWithoutMovieInputObjectSchema } from './ProductionCompanyOnMovieCreateOrConnectWithoutMovieInput.schema';
import { ProductionCompanyOnMovieWhereUniqueInputObjectSchema } from './ProductionCompanyOnMovieWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieCreateNestedManyWithoutMovieInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(
            () => ProductionCompanyOnMovieCreateWithoutMovieInputObjectSchema,
          ),
          z
            .lazy(
              () => ProductionCompanyOnMovieCreateWithoutMovieInputObjectSchema,
            )
            .array(),
          z.lazy(
            () =>
              ProductionCompanyOnMovieUncheckedCreateWithoutMovieInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                ProductionCompanyOnMovieUncheckedCreateWithoutMovieInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () =>
              ProductionCompanyOnMovieCreateOrConnectWithoutMovieInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                ProductionCompanyOnMovieCreateOrConnectWithoutMovieInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => ProductionCompanyOnMovieWhereUniqueInputObjectSchema),
          z
            .lazy(() => ProductionCompanyOnMovieWhereUniqueInputObjectSchema)
            .array(),
        ])
        .optional(),
    })
    .strict();

export const ProductionCompanyOnMovieCreateNestedManyWithoutMovieInputObjectSchema =
  Schema;
