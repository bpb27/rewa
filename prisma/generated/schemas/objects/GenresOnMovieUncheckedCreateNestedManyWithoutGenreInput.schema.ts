import { z } from 'zod';
import { GenresOnMovieCreateWithoutGenreInputObjectSchema } from './GenresOnMovieCreateWithoutGenreInput.schema';
import { GenresOnMovieUncheckedCreateWithoutGenreInputObjectSchema } from './GenresOnMovieUncheckedCreateWithoutGenreInput.schema';
import { GenresOnMovieCreateOrConnectWithoutGenreInputObjectSchema } from './GenresOnMovieCreateOrConnectWithoutGenreInput.schema';
import { GenresOnMovieWhereUniqueInputObjectSchema } from './GenresOnMovieWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieUncheckedCreateNestedManyWithoutGenreInput> =
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
      connect: z
        .union([
          z.lazy(() => GenresOnMovieWhereUniqueInputObjectSchema),
          z.lazy(() => GenresOnMovieWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const GenresOnMovieUncheckedCreateNestedManyWithoutGenreInputObjectSchema =
  Schema;
