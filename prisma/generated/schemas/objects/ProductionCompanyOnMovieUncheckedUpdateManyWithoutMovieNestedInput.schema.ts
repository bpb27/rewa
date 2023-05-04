import { z } from 'zod';
import { ProductionCompanyOnMovieCreateWithoutMovieInputObjectSchema } from './ProductionCompanyOnMovieCreateWithoutMovieInput.schema';
import { ProductionCompanyOnMovieUncheckedCreateWithoutMovieInputObjectSchema } from './ProductionCompanyOnMovieUncheckedCreateWithoutMovieInput.schema';
import { ProductionCompanyOnMovieCreateOrConnectWithoutMovieInputObjectSchema } from './ProductionCompanyOnMovieCreateOrConnectWithoutMovieInput.schema';
import { ProductionCompanyOnMovieUpsertWithWhereUniqueWithoutMovieInputObjectSchema } from './ProductionCompanyOnMovieUpsertWithWhereUniqueWithoutMovieInput.schema';
import { ProductionCompanyOnMovieWhereUniqueInputObjectSchema } from './ProductionCompanyOnMovieWhereUniqueInput.schema';
import { ProductionCompanyOnMovieUpdateWithWhereUniqueWithoutMovieInputObjectSchema } from './ProductionCompanyOnMovieUpdateWithWhereUniqueWithoutMovieInput.schema';
import { ProductionCompanyOnMovieUpdateManyWithWhereWithoutMovieInputObjectSchema } from './ProductionCompanyOnMovieUpdateManyWithWhereWithoutMovieInput.schema';
import { ProductionCompanyOnMovieScalarWhereInputObjectSchema } from './ProductionCompanyOnMovieScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieUncheckedUpdateManyWithoutMovieNestedInput> =
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
      upsert: z
        .union([
          z.lazy(
            () =>
              ProductionCompanyOnMovieUpsertWithWhereUniqueWithoutMovieInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                ProductionCompanyOnMovieUpsertWithWhereUniqueWithoutMovieInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      set: z
        .union([
          z.lazy(() => ProductionCompanyOnMovieWhereUniqueInputObjectSchema),
          z
            .lazy(() => ProductionCompanyOnMovieWhereUniqueInputObjectSchema)
            .array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => ProductionCompanyOnMovieWhereUniqueInputObjectSchema),
          z
            .lazy(() => ProductionCompanyOnMovieWhereUniqueInputObjectSchema)
            .array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => ProductionCompanyOnMovieWhereUniqueInputObjectSchema),
          z
            .lazy(() => ProductionCompanyOnMovieWhereUniqueInputObjectSchema)
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
      update: z
        .union([
          z.lazy(
            () =>
              ProductionCompanyOnMovieUpdateWithWhereUniqueWithoutMovieInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                ProductionCompanyOnMovieUpdateWithWhereUniqueWithoutMovieInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(
            () =>
              ProductionCompanyOnMovieUpdateManyWithWhereWithoutMovieInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                ProductionCompanyOnMovieUpdateManyWithWhereWithoutMovieInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => ProductionCompanyOnMovieScalarWhereInputObjectSchema),
          z
            .lazy(() => ProductionCompanyOnMovieScalarWhereInputObjectSchema)
            .array(),
        ])
        .optional(),
    })
    .strict();

export const ProductionCompanyOnMovieUncheckedUpdateManyWithoutMovieNestedInputObjectSchema =
  Schema;
