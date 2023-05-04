import { z } from 'zod';
import { GenresOnMovieCreateWithoutGenreInputObjectSchema } from './GenresOnMovieCreateWithoutGenreInput.schema';
import { GenresOnMovieUncheckedCreateWithoutGenreInputObjectSchema } from './GenresOnMovieUncheckedCreateWithoutGenreInput.schema';
import { GenresOnMovieCreateOrConnectWithoutGenreInputObjectSchema } from './GenresOnMovieCreateOrConnectWithoutGenreInput.schema';
import { GenresOnMovieUpsertWithWhereUniqueWithoutGenreInputObjectSchema } from './GenresOnMovieUpsertWithWhereUniqueWithoutGenreInput.schema';
import { GenresOnMovieWhereUniqueInputObjectSchema } from './GenresOnMovieWhereUniqueInput.schema';
import { GenresOnMovieUpdateWithWhereUniqueWithoutGenreInputObjectSchema } from './GenresOnMovieUpdateWithWhereUniqueWithoutGenreInput.schema';
import { GenresOnMovieUpdateManyWithWhereWithoutGenreInputObjectSchema } from './GenresOnMovieUpdateManyWithWhereWithoutGenreInput.schema';
import { GenresOnMovieScalarWhereInputObjectSchema } from './GenresOnMovieScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieUpdateManyWithoutGenreNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => GenresOnMovieCreateWithoutGenreInputObjectSchema),
          z
            .lazy(() => GenresOnMovieCreateWithoutGenreInputObjectSchema)
            .array(),
          z.lazy(
            () => GenresOnMovieUncheckedCreateWithoutGenreInputObjectSchema,
          ),
          z
            .lazy(
              () => GenresOnMovieUncheckedCreateWithoutGenreInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () => GenresOnMovieCreateOrConnectWithoutGenreInputObjectSchema,
          ),
          z
            .lazy(
              () => GenresOnMovieCreateOrConnectWithoutGenreInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () =>
              GenresOnMovieUpsertWithWhereUniqueWithoutGenreInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                GenresOnMovieUpsertWithWhereUniqueWithoutGenreInputObjectSchema,
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
              GenresOnMovieUpdateWithWhereUniqueWithoutGenreInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                GenresOnMovieUpdateWithWhereUniqueWithoutGenreInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(
            () => GenresOnMovieUpdateManyWithWhereWithoutGenreInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                GenresOnMovieUpdateManyWithWhereWithoutGenreInputObjectSchema,
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

export const GenresOnMovieUpdateManyWithoutGenreNestedInputObjectSchema =
  Schema;
