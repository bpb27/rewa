import { z } from 'zod';
import { CastCreateWithoutMovieInputObjectSchema } from './CastCreateWithoutMovieInput.schema';
import { CastUncheckedCreateWithoutMovieInputObjectSchema } from './CastUncheckedCreateWithoutMovieInput.schema';
import { CastCreateOrConnectWithoutMovieInputObjectSchema } from './CastCreateOrConnectWithoutMovieInput.schema';
import { CastUpsertWithWhereUniqueWithoutMovieInputObjectSchema } from './CastUpsertWithWhereUniqueWithoutMovieInput.schema';
import { CastWhereUniqueInputObjectSchema } from './CastWhereUniqueInput.schema';
import { CastUpdateWithWhereUniqueWithoutMovieInputObjectSchema } from './CastUpdateWithWhereUniqueWithoutMovieInput.schema';
import { CastUpdateManyWithWhereWithoutMovieInputObjectSchema } from './CastUpdateManyWithWhereWithoutMovieInput.schema';
import { CastScalarWhereInputObjectSchema } from './CastScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CastUncheckedUpdateManyWithoutMovieNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => CastCreateWithoutMovieInputObjectSchema),
          z.lazy(() => CastCreateWithoutMovieInputObjectSchema).array(),
          z.lazy(() => CastUncheckedCreateWithoutMovieInputObjectSchema),
          z
            .lazy(() => CastUncheckedCreateWithoutMovieInputObjectSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => CastCreateOrConnectWithoutMovieInputObjectSchema),
          z
            .lazy(() => CastCreateOrConnectWithoutMovieInputObjectSchema)
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => CastUpsertWithWhereUniqueWithoutMovieInputObjectSchema),
          z
            .lazy(() => CastUpsertWithWhereUniqueWithoutMovieInputObjectSchema)
            .array(),
        ])
        .optional(),
      set: z
        .union([
          z.lazy(() => CastWhereUniqueInputObjectSchema),
          z.lazy(() => CastWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => CastWhereUniqueInputObjectSchema),
          z.lazy(() => CastWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => CastWhereUniqueInputObjectSchema),
          z.lazy(() => CastWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => CastWhereUniqueInputObjectSchema),
          z.lazy(() => CastWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => CastUpdateWithWhereUniqueWithoutMovieInputObjectSchema),
          z
            .lazy(() => CastUpdateWithWhereUniqueWithoutMovieInputObjectSchema)
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => CastUpdateManyWithWhereWithoutMovieInputObjectSchema),
          z
            .lazy(() => CastUpdateManyWithWhereWithoutMovieInputObjectSchema)
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => CastScalarWhereInputObjectSchema),
          z.lazy(() => CastScalarWhereInputObjectSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const CastUncheckedUpdateManyWithoutMovieNestedInputObjectSchema =
  Schema;
