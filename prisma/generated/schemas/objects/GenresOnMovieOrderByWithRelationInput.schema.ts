import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { MovieOrderByWithRelationInputObjectSchema } from './MovieOrderByWithRelationInput.schema';
import { GenreOrderByWithRelationInputObjectSchema } from './GenreOrderByWithRelationInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieOrderByWithRelationInput> = z
  .object({
    movieId: z.lazy(() => SortOrderSchema).optional(),
    genreId: z.lazy(() => SortOrderSchema).optional(),
    movie: z.lazy(() => MovieOrderByWithRelationInputObjectSchema).optional(),
    genre: z.lazy(() => GenreOrderByWithRelationInputObjectSchema).optional(),
  })
  .strict();

export const GenresOnMovieOrderByWithRelationInputObjectSchema = Schema;
