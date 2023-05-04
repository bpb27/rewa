import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieMinOrderByAggregateInput> = z
  .object({
    movieId: z.lazy(() => SortOrderSchema).optional(),
    genreId: z.lazy(() => SortOrderSchema).optional(),
  })
  .strict();

export const GenresOnMovieMinOrderByAggregateInputObjectSchema = Schema;
