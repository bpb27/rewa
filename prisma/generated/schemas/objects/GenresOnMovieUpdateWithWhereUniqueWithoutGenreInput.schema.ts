import { z } from 'zod';
import { GenresOnMovieWhereUniqueInputObjectSchema } from './GenresOnMovieWhereUniqueInput.schema';
import { GenresOnMovieUpdateWithoutGenreInputObjectSchema } from './GenresOnMovieUpdateWithoutGenreInput.schema';
import { GenresOnMovieUncheckedUpdateWithoutGenreInputObjectSchema } from './GenresOnMovieUncheckedUpdateWithoutGenreInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieUpdateWithWhereUniqueWithoutGenreInput> =
  z
    .object({
      where: z.lazy(() => GenresOnMovieWhereUniqueInputObjectSchema),
      data: z.union([
        z.lazy(() => GenresOnMovieUpdateWithoutGenreInputObjectSchema),
        z.lazy(() => GenresOnMovieUncheckedUpdateWithoutGenreInputObjectSchema),
      ]),
    })
    .strict();

export const GenresOnMovieUpdateWithWhereUniqueWithoutGenreInputObjectSchema =
  Schema;
