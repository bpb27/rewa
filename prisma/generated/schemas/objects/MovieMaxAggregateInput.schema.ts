import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.MovieMaxAggregateInputType> = z
  .object({
    id: z.literal(true).optional(),
    adult: z.literal(true).optional(),
    backdrop_path: z.literal(true).optional(),
    belongs_to_collection: z.literal(true).optional(),
    budget: z.literal(true).optional(),
    homepage: z.literal(true).optional(),
    imdb_id: z.literal(true).optional(),
    original_language: z.literal(true).optional(),
    original_title: z.literal(true).optional(),
    overview: z.literal(true).optional(),
    popularity: z.literal(true).optional(),
    poster_path: z.literal(true).optional(),
    release_date: z.literal(true).optional(),
    revenue: z.literal(true).optional(),
    runtime: z.literal(true).optional(),
    status: z.literal(true).optional(),
    tagline: z.literal(true).optional(),
    title: z.literal(true).optional(),
    video: z.literal(true).optional(),
    vote_average: z.literal(true).optional(),
    vote_count: z.literal(true).optional(),
  })
  .strict();

export const MovieMaxAggregateInputObjectSchema = Schema;
