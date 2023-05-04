import { z } from 'zod';
import { GenresOnMovieCreateWithoutMovieInputObjectSchema } from './GenresOnMovieCreateWithoutMovieInput.schema';
import { GenresOnMovieUncheckedCreateWithoutMovieInputObjectSchema } from './GenresOnMovieUncheckedCreateWithoutMovieInput.schema';
import { GenresOnMovieCreateOrConnectWithoutMovieInputObjectSchema } from './GenresOnMovieCreateOrConnectWithoutMovieInput.schema';
import { GenresOnMovieUpsertWithWhereUniqueWithoutMovieInputObjectSchema } from './GenresOnMovieUpsertWithWhereUniqueWithoutMovieInput.schema';
import { GenresOnMovieWhereUniqueInputObjectSchema } from './GenresOnMovieWhereUniqueInput.schema';
import { GenresOnMovieUpdateWithWhereUniqueWithoutMovieInputObjectSchema } from './GenresOnMovieUpdateWithWhereUniqueWithoutMovieInput.schema';
import { GenresOnMovieUpdateManyWithWhereWithoutMovieInputObjectSchema } from './GenresOnMovieUpdateManyWithWhereWithoutMovieInput.schema';
import { GenresOnMovieScalarWhereInputObjectSchema } from './GenresOnMovieScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieUncheckedUpdateManyWithoutMovieNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => GenresOnMovieCreateWithoutMovieInputObjectSchema),
          z
            .lazy(() => GenresOnMovieCreateWithoutMovieInputObjectSchema)
            .array(),
          z.lazy(
            () => GenresOnMovieUncheckedCreateWithoutMovieInputObjectSchema,
          ),
          z
            .lazy(
              () => GenresOnMovieUncheckedCreateWithoutMovieInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () => GenresOnMovieCreateOrConnectWithoutMovieInputObjectSchema,
          ),
          z
            .lazy(
              () => GenresOnMovieCreateOrConnectWithoutMovieInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () =>
              GenresOnMovieUpsertWithWhereUniqueWithoutMovieInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                GenresOnMovieUpsertWithWhereUniqueWithoutMovieInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      set: z
        .union([
          z.lazy(() => GenresOnMovieWhereUniqueInputObjectSchema),
          z.lazy(() => GenresOnMovieWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => GenresOnMovieWhereUniqueInputObjectSchema),
          z.lazy(() => GenresOnMovieWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => GenresOnMovieWhereUniqueInputObjectSchema),
          z.lazy(() => GenresOnMovieWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => GenresOnMovieWhereUniqueInputObjectSchema),
          z.lazy(() => GenresOnMovieWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () =>
              GenresOnMovieUpdateWithWhereUniqueWithoutMovieInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                GenresOnMovieUpdateWithWhereUniqueWithoutMovieInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(
            () => GenresOnMovieUpdateManyWithWhereWithoutMovieInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                GenresOnMovieUpdateManyWithWhereWithoutMovieInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => GenresOnMovieScalarWhereInputObjectSchema),
          z.lazy(() => GenresOnMovieScalarWhereInputObjectSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const GenresOnMovieUncheckedUpdateManyWithoutMovieNestedInputObjectSchema =
  Schema;
