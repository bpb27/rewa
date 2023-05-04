import { z } from 'zod';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { MovieOrderByWithRelationInputObjectSchema } from './MovieOrderByWithRelationInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CrewOrderByWithRelationInput> = z
  .object({
    adult: z.lazy(() => SortOrderSchema).optional(),
    gender: z.lazy(() => SortOrderSchema).optional(),
    known_for_department: z.lazy(() => SortOrderSchema).optional(),
    name: z.lazy(() => SortOrderSchema).optional(),
    original_name: z.lazy(() => SortOrderSchema).optional(),
    popularity: z.lazy(() => SortOrderSchema).optional(),
    profile_path: z.lazy(() => SortOrderSchema).optional(),
    credit_id: z.lazy(() => SortOrderSchema).optional(),
    department: z.lazy(() => SortOrderSchema).optional(),
    job: z.lazy(() => SortOrderSchema).optional(),
    movie_id: z.lazy(() => SortOrderSchema).optional(),
    Movie: z.lazy(() => MovieOrderByWithRelationInputObjectSchema).optional(),
  })
  .strict();

export const CrewOrderByWithRelationInputObjectSchema = Schema;
