import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieScalarWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => GenresOnMovieScalarWhereInputObjectSchema),
        z.lazy(() => GenresOnMovieScalarWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => GenresOnMovieScalarWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => GenresOnMovieScalarWhereInputObjectSchema),
        z.lazy(() => GenresOnMovieScalarWhereInputObjectSchema).array(),
      ])
      .optional(),
    movieId: z
      .union([z.lazy(() => IntFilterObjectSchema), z.number()])
      .optional(),
    genreId: z
      .union([z.lazy(() => IntFilterObjectSchema), z.number()])
      .optional(),
  })
  .strict();

export const GenresOnMovieScalarWhereInputObjectSchema = Schema;
