import { z } from 'zod';
import { GenresOnMovieWhereInputObjectSchema } from './GenresOnMovieWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieListRelationFilter> = z
  .object({
    every: z.lazy(() => GenresOnMovieWhereInputObjectSchema).optional(),
    some: z.lazy(() => GenresOnMovieWhereInputObjectSchema).optional(),
    none: z.lazy(() => GenresOnMovieWhereInputObjectSchema).optional(),
  })
  .strict();

export const GenresOnMovieListRelationFilterObjectSchema = Schema;
