import { z } from 'zod';
import { GenresOnMovieUncheckedCreateNestedManyWithoutGenreInputObjectSchema } from './GenresOnMovieUncheckedCreateNestedManyWithoutGenreInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenreUncheckedCreateInput> = z
  .object({
    id: z.number(),
    name: z.string(),
    movies: z
      .lazy(
        () =>
          GenresOnMovieUncheckedCreateNestedManyWithoutGenreInputObjectSchema,
      )
      .optional(),
  })
  .strict();

export const GenreUncheckedCreateInputObjectSchema = Schema;
