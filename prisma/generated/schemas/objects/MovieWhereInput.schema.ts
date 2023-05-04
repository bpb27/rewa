import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { FloatFilterObjectSchema } from './FloatFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { BigIntFilterObjectSchema } from './BigIntFilter.schema';
import { CastListRelationFilterObjectSchema } from './CastListRelationFilter.schema';
import { CrewListRelationFilterObjectSchema } from './CrewListRelationFilter.schema';
import { GenresOnMovieListRelationFilterObjectSchema } from './GenresOnMovieListRelationFilter.schema';
import { ProductionCompanyOnMovieListRelationFilterObjectSchema } from './ProductionCompanyOnMovieListRelationFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.MovieWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => MovieWhereInputObjectSchema),
        z.lazy(() => MovieWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => MovieWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => MovieWhereInputObjectSchema),
        z.lazy(() => MovieWhereInputObjectSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
    adult: z
      .union([z.lazy(() => BoolFilterObjectSchema), z.boolean()])
      .optional(),
    backdrop_path: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    belongs_to_collection: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    budget: z
      .union([z.lazy(() => IntFilterObjectSchema), z.number()])
      .optional(),
    homepage: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    imdb_id: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    original_language: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    original_title: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    overview: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    popularity: z
      .union([z.lazy(() => FloatFilterObjectSchema), z.number()])
      .optional(),
    poster_path: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    release_date: z
      .union([z.lazy(() => DateTimeFilterObjectSchema), z.date()])
      .optional(),
    revenue: z
      .union([z.lazy(() => BigIntFilterObjectSchema), z.bigint()])
      .optional(),
    runtime: z
      .union([z.lazy(() => IntFilterObjectSchema), z.number()])
      .optional(),
    status: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    tagline: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    title: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    video: z
      .union([z.lazy(() => BoolFilterObjectSchema), z.boolean()])
      .optional(),
    vote_average: z
      .union([z.lazy(() => FloatFilterObjectSchema), z.number()])
      .optional(),
    vote_count: z
      .union([z.lazy(() => IntFilterObjectSchema), z.number()])
      .optional(),
    cast: z.lazy(() => CastListRelationFilterObjectSchema).optional(),
    crew: z.lazy(() => CrewListRelationFilterObjectSchema).optional(),
    genres: z
      .lazy(() => GenresOnMovieListRelationFilterObjectSchema)
      .optional(),
    production_companies: z
      .lazy(() => ProductionCompanyOnMovieListRelationFilterObjectSchema)
      .optional(),
  })
  .strict();

export const MovieWhereInputObjectSchema = Schema;
