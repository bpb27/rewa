import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { MovieRelationFilterObjectSchema } from './MovieRelationFilter.schema';
import { MovieWhereInputObjectSchema } from './MovieWhereInput.schema';
import { GenreRelationFilterObjectSchema } from './GenreRelationFilter.schema';
import { GenreWhereInputObjectSchema } from './GenreWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => GenresOnMovieWhereInputObjectSchema),
        z.lazy(() => GenresOnMovieWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => GenresOnMovieWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => GenresOnMovieWhereInputObjectSchema),
        z.lazy(() => GenresOnMovieWhereInputObjectSchema).array(),
      ])
      .optional(),
    movieId: z
      .union([z.lazy(() => IntFilterObjectSchema), z.number()])
      .optional(),
    genreId: z
      .union([z.lazy(() => IntFilterObjectSchema), z.number()])
      .optional(),
    movie: z
      .union([
        z.lazy(() => MovieRelationFilterObjectSchema),
        z.lazy(() => MovieWhereInputObjectSchema),
      ])
      .optional(),
    genre: z
      .union([
        z.lazy(() => GenreRelationFilterObjectSchema),
        z.lazy(() => GenreWhereInputObjectSchema),
      ])
      .optional(),
  })
  .strict();

export const GenresOnMovieWhereInputObjectSchema = Schema;
