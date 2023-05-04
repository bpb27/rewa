import { z } from 'zod';
import { GenreUpdateOneRequiredWithoutMoviesNestedInputObjectSchema } from './GenreUpdateOneRequiredWithoutMoviesNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieUpdateWithoutMovieInput> = z
  .object({
    genre: z
      .lazy(() => GenreUpdateOneRequiredWithoutMoviesNestedInputObjectSchema)
      .optional(),
  })
  .strict();

export const GenresOnMovieUpdateWithoutMovieInputObjectSchema = Schema;
