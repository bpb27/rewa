import { z } from 'zod';
import { MovieCreateNestedOneWithoutGenresInputObjectSchema } from './MovieCreateNestedOneWithoutGenresInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieCreateWithoutGenreInput> = z
  .object({
    movie: z.lazy(() => MovieCreateNestedOneWithoutGenresInputObjectSchema),
  })
  .strict();

export const GenresOnMovieCreateWithoutGenreInputObjectSchema = Schema;
