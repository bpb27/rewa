import { z } from 'zod';
import { GenresOnMovieWhereUniqueInputObjectSchema } from './GenresOnMovieWhereUniqueInput.schema';
import { GenresOnMovieUpdateWithoutGenreInputObjectSchema } from './GenresOnMovieUpdateWithoutGenreInput.schema';
import { GenresOnMovieUncheckedUpdateWithoutGenreInputObjectSchema } from './GenresOnMovieUncheckedUpdateWithoutGenreInput.schema';
import { GenresOnMovieCreateWithoutGenreInputObjectSchema } from './GenresOnMovieCreateWithoutGenreInput.schema';
import { GenresOnMovieUncheckedCreateWithoutGenreInputObjectSchema } from './GenresOnMovieUncheckedCreateWithoutGenreInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieUpsertWithWhereUniqueWithoutGenreInput> =
  z
    .object({
      where: z.lazy(() => GenresOnMovieWhereUniqueInputObjectSchema),
      update: z.union([
        z.lazy(() => GenresOnMovieUpdateWithoutGenreInputObjectSchema),
        z.lazy(() => GenresOnMovieUncheckedUpdateWithoutGenreInputObjectSchema),
      ]),
      create: z.union([
        z.lazy(() => GenresOnMovieCreateWithoutGenreInputObjectSchema),
        z.lazy(() => GenresOnMovieUncheckedCreateWithoutGenreInputObjectSchema),
      ]),
    })
    .strict();

export const GenresOnMovieUpsertWithWhereUniqueWithoutGenreInputObjectSchema =
  Schema;
