import { z } from 'zod';
import { GenresOnMovieCreateNestedManyWithoutGenreInputObjectSchema } from './GenresOnMovieCreateNestedManyWithoutGenreInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenreCreateInput> = z
  .object({
    id: z.number(),
    name: z.string(),
    movies: z
      .lazy(() => GenresOnMovieCreateNestedManyWithoutGenreInputObjectSchema)
      .optional(),
  })
  .strict();

export const GenreCreateInputObjectSchema = Schema;
