import { z } from 'zod';
import { GenresOnMovieMovieIdGenreIdCompoundUniqueInputObjectSchema } from './GenresOnMovieMovieIdGenreIdCompoundUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieWhereUniqueInput> = z
  .object({
    movieId_genreId: z
      .lazy(() => GenresOnMovieMovieIdGenreIdCompoundUniqueInputObjectSchema)
      .optional(),
  })
  .strict();

export const GenresOnMovieWhereUniqueInputObjectSchema = Schema;
