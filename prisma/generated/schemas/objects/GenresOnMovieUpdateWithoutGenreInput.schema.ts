import { z } from 'zod';
import { MovieUpdateOneRequiredWithoutGenresNestedInputObjectSchema } from './MovieUpdateOneRequiredWithoutGenresNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieUpdateWithoutGenreInput> = z
  .object({
    movie: z
      .lazy(() => MovieUpdateOneRequiredWithoutGenresNestedInputObjectSchema)
      .optional(),
  })
  .strict();

export const GenresOnMovieUpdateWithoutGenreInputObjectSchema = Schema;
