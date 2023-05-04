import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.MovieMinOrderByAggregateInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    adult: z.lazy(() => SortOrderSchema).optional(),
    backdrop_path: z.lazy(() => SortOrderSchema).optional(),
    belongs_to_collection: z.lazy(() => SortOrderSchema).optional(),
    budget: z.lazy(() => SortOrderSchema).optional(),
    homepage: z.lazy(() => SortOrderSchema).optional(),
    imdb_id: z.lazy(() => SortOrderSchema).optional(),
    original_language: z.lazy(() => SortOrderSchema).optional(),
    original_title: z.lazy(() => SortOrderSchema).optional(),
    overview: z.lazy(() => SortOrderSchema).optional(),
    popularity: z.lazy(() => SortOrderSchema).optional(),
    poster_path: z.lazy(() => SortOrderSchema).optional(),
    release_date: z.lazy(() => SortOrderSchema).optional(),
    revenue: z.lazy(() => SortOrderSchema).optional(),
    runtime: z.lazy(() => SortOrderSchema).optional(),
    status: z.lazy(() => SortOrderSchema).optional(),
    tagline: z.lazy(() => SortOrderSchema).optional(),
    title: z.lazy(() => SortOrderSchema).optional(),
    video: z.lazy(() => SortOrderSchema).optional(),
    vote_average: z.lazy(() => SortOrderSchema).optional(),
    vote_count: z.lazy(() => SortOrderSchema).optional(),
  })
  .strict();

export const MovieMinOrderByAggregateInputObjectSchema = Schema;
