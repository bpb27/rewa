import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { GenresOnMovieCountOrderByAggregateInputObjectSchema } from './GenresOnMovieCountOrderByAggregateInput.schema';
import { GenresOnMovieAvgOrderByAggregateInputObjectSchema } from './GenresOnMovieAvgOrderByAggregateInput.schema';
import { GenresOnMovieMaxOrderByAggregateInputObjectSchema } from './GenresOnMovieMaxOrderByAggregateInput.schema';
import { GenresOnMovieMinOrderByAggregateInputObjectSchema } from './GenresOnMovieMinOrderByAggregateInput.schema';
import { GenresOnMovieSumOrderByAggregateInputObjectSchema } from './GenresOnMovieSumOrderByAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieOrderByWithAggregationInput> = z
  .object({
    movieId: z.lazy(() => SortOrderSchema).optional(),
    genreId: z.lazy(() => SortOrderSchema).optional(),
    _count: z
      .lazy(() => GenresOnMovieCountOrderByAggregateInputObjectSchema)
      .optional(),
    _avg: z
      .lazy(() => GenresOnMovieAvgOrderByAggregateInputObjectSchema)
      .optional(),
    _max: z
      .lazy(() => GenresOnMovieMaxOrderByAggregateInputObjectSchema)
      .optional(),
    _min: z
      .lazy(() => GenresOnMovieMinOrderByAggregateInputObjectSchema)
      .optional(),
    _sum: z
      .lazy(() => GenresOnMovieSumOrderByAggregateInputObjectSchema)
      .optional(),
  })
  .strict();

export const GenresOnMovieOrderByWithAggregationInputObjectSchema = Schema;
