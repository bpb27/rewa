import { z } from 'zod';
import { MovieCreateNestedOneWithoutGenresInputObjectSchema } from './MovieCreateNestedOneWithoutGenresInput.schema';
import { GenreCreateNestedOneWithoutMoviesInputObjectSchema } from './GenreCreateNestedOneWithoutMoviesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieCreateInput> = z
  .object({
    movie: z.lazy(() => MovieCreateNestedOneWithoutGenresInputObjectSchema),
    genre: z.lazy(() => GenreCreateNestedOneWithoutMoviesInputObjectSchema),
  })
  .strict();

export const GenresOnMovieCreateInputObjectSchema = Schema;
