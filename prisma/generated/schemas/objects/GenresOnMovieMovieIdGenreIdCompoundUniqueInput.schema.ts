import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieMovieIdGenreIdCompoundUniqueInput> =
  z
    .object({
      movieId: z.number(),
      genreId: z.number(),
    })
    .strict();

export const GenresOnMovieMovieIdGenreIdCompoundUniqueInputObjectSchema =
  Schema;
