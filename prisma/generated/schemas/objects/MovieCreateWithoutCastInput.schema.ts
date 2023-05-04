import { z } from 'zod';
import { CrewCreateNestedManyWithoutMovieInputObjectSchema } from './CrewCreateNestedManyWithoutMovieInput.schema';
import { GenresOnMovieCreateNestedManyWithoutMovieInputObjectSchema } from './GenresOnMovieCreateNestedManyWithoutMovieInput.schema';
import { ProductionCompanyOnMovieCreateNestedManyWithoutMovieInputObjectSchema } from './ProductionCompanyOnMovieCreateNestedManyWithoutMovieInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.MovieCreateWithoutCastInput> = z
  .object({
    id: z.number(),
    adult: z.boolean(),
    backdrop_path: z.string().optional().nullable(),
    belongs_to_collection: z.string().optional().nullable(),
    budget: z.number(),
    homepage: z.string().optional().nullable(),
    imdb_id: z.string().optional().nullable(),
    original_language: z.string(),
    original_title: z.string(),
    overview: z.string(),
    popularity: z.number(),
    poster_path: z.string().optional().nullable(),
    release_date: z.date(),
    revenue: z.bigint(),
    runtime: z.number(),
    status: z.string(),
    tagline: z.string(),
    title: z.string(),
    video: z.boolean(),
    vote_average: z.number(),
    vote_count: z.number(),
    crew: z
      .lazy(() => CrewCreateNestedManyWithoutMovieInputObjectSchema)
      .optional(),
    genres: z
      .lazy(() => GenresOnMovieCreateNestedManyWithoutMovieInputObjectSchema)
      .optional(),
    production_companies: z
      .lazy(
        () =>
          ProductionCompanyOnMovieCreateNestedManyWithoutMovieInputObjectSchema,
      )
      .optional(),
  })
  .strict();

export const MovieCreateWithoutCastInputObjectSchema = Schema;
