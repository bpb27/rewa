import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { GenresOnMovieOrderByRelationAggregateInputObjectSchema } from './GenresOnMovieOrderByRelationAggregateInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenreOrderByWithRelationInput> = z
  .object({
    id: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    movies: z
      .lazy(() => GenresOnMovieOrderByRelationAggregateInputObjectSchema)
      .optional(),
  })
  .strict();

export const GenreOrderByWithRelationInputObjectSchema = Schema;
