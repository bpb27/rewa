import { z } from 'zod';
import { IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieScalarWhereWithAggregatesInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => GenresOnMovieScalarWhereWithAggregatesInputObjectSchema),
        z
          .lazy(() => GenresOnMovieScalarWhereWithAggregatesInputObjectSchema)
          .array(),
      ])
      .optional(),
    OR: z
      .lazy(() => GenresOnMovieScalarWhereWithAggregatesInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => GenresOnMovieScalarWhereWithAggregatesInputObjectSchema),
        z
          .lazy(() => GenresOnMovieScalarWhereWithAggregatesInputObjectSchema)
          .array(),
      ])
      .optional(),
    movieId: z
      .union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number()])
      .optional(),
    genreId: z
      .union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number()])
      .optional(),
  })
  .strict();

export const GenresOnMovieScalarWhereWithAggregatesInputObjectSchema = Schema;
