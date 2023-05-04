import { z } from 'zod';
import { ProductionCompanyOnMovieCreateWithoutProductionCompanyInputObjectSchema } from './ProductionCompanyOnMovieCreateWithoutProductionCompanyInput.schema';
import { ProductionCompanyOnMovieUncheckedCreateWithoutProductionCompanyInputObjectSchema } from './ProductionCompanyOnMovieUncheckedCreateWithoutProductionCompanyInput.schema';
import { ProductionCompanyOnMovieCreateOrConnectWithoutProductionCompanyInputObjectSchema } from './ProductionCompanyOnMovieCreateOrConnectWithoutProductionCompanyInput.schema';
import { ProductionCompanyOnMovieUpsertWithWhereUniqueWithoutProductionCompanyInputObjectSchema } from './ProductionCompanyOnMovieUpsertWithWhereUniqueWithoutProductionCompanyInput.schema';
import { ProductionCompanyOnMovieWhereUniqueInputObjectSchema } from './ProductionCompanyOnMovieWhereUniqueInput.schema';
import { ProductionCompanyOnMovieUpdateWithWhereUniqueWithoutProductionCompanyInputObjectSchema } from './ProductionCompanyOnMovieUpdateWithWhereUniqueWithoutProductionCompanyInput.schema';
import { ProductionCompanyOnMovieUpdateManyWithWhereWithoutProductionCompanyInputObjectSchema } from './ProductionCompanyOnMovieUpdateManyWithWhereWithoutProductionCompanyInput.schema';
import { ProductionCompanyOnMovieScalarWhereInputObjectSchema } from './ProductionCompanyOnMovieScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieUncheckedUpdateManyWithoutProductionCompanyNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(
            () =>
              ProductionCompanyOnMovieCreateWithoutProductionCompanyInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                ProductionCompanyOnMovieCreateWithoutProductionCompanyInputObjectSchema,
            )
            .array(),
          z.lazy(
            () =>
              ProductionCompanyOnMovieUncheckedCreateWithoutProductionCompanyInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                ProductionCompanyOnMovieUncheckedCreateWithoutProductionCompanyInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () =>
              ProductionCompanyOnMovieCreateOrConnectWithoutProductionCompanyInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                ProductionCompanyOnMovieCreateOrConnectWithoutProductionCompanyInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () =>
              ProductionCompanyOnMovieUpsertWithWhereUniqueWithoutProductionCompanyInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                ProductionCompanyOnMovieUpsertWithWhereUniqueWithoutProductionCompanyInputObjectSchema,
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
              ProductionCompanyOnMovieUpdateWithWhereUniqueWithoutProductionCompanyInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                ProductionCompanyOnMovieUpdateWithWhereUniqueWithoutProductionCompanyInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(
            () =>
              ProductionCompanyOnMovieUpdateManyWithWhereWithoutProductionCompanyInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                ProductionCompanyOnMovieUpdateManyWithWhereWithoutProductionCompanyInputObjectSchema,
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

export const ProductionCompanyOnMovieUncheckedUpdateManyWithoutProductionCompanyNestedInputObjectSchema =
  Schema;
