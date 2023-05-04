import { z } from 'zod';
import { GenreCreateNestedOneWithoutMoviesInputObjectSchema } from './GenreCreateNestedOneWithoutMoviesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieCreateWithoutMovieInput> = z
  .object({
    genre: z.lazy(() => GenreCreateNestedOneWithoutMoviesInputObjectSchema),
  })
  .strict();

export const GenresOnMovieCreateWithoutMovieInputObjectSchema = Schema;
