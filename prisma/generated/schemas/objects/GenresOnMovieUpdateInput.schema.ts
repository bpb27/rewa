import { z } from 'zod';
import { MovieUpdateOneRequiredWithoutGenresNestedInputObjectSchema } from './MovieUpdateOneRequiredWithoutGenresNestedInput.schema';
import { GenreUpdateOneRequiredWithoutMoviesNestedInputObjectSchema } from './GenreUpdateOneRequiredWithoutMoviesNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieUpdateInput> = z
  .object({
    movie: z
      .lazy(() => MovieUpdateOneRequiredWithoutGenresNestedInputObjectSchema)
      .optional(),
    genre: z
      .lazy(() => GenreUpdateOneRequiredWithoutMoviesNestedInputObjectSchema)
      .optional(),
  })
  .strict();

export const GenresOnMovieUpdateInputObjectSchema = Schema;
