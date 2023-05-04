import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieUncheckedCreateWithoutGenreInput> =
  z
    .object({
      movieId: z.number(),
    })
    .strict();

export const GenresOnMovieUncheckedCreateWithoutGenreInputObjectSchema = Schema;
