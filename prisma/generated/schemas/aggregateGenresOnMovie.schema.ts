import { z } from 'zod';
import { GenresOnMovieOrderByWithRelationInputObjectSchema } from './objects/GenresOnMovieOrderByWithRelationInput.schema';
import { GenresOnMovieWhereInputObjectSchema } from './objects/GenresOnMovieWhereInput.schema';
import { GenresOnMovieWhereUniqueInputObjectSchema } from './objects/GenresOnMovieWhereUniqueInput.schema';
import { GenresOnMovieCountAggregateInputObjectSchema } from './objects/GenresOnMovieCountAggregateInput.schema';
import { GenresOnMovieMinAggregateInputObjectSchema } from './objects/GenresOnMovieMinAggregateInput.schema';
import { GenresOnMovieMaxAggregateInputObjectSchema } from './objects/GenresOnMovieMaxAggregateInput.schema';
import { GenresOnMovieAvgAggregateInputObjectSchema } from './objects/GenresOnMovieAvgAggregateInput.schema';
import { GenresOnMovieSumAggregateInputObjectSchema } from './objects/GenresOnMovieSumAggregateInput.schema';

export const GenresOnMovieAggregateSchema = z.object({
  orderBy: z
    .union([
      GenresOnMovieOrderByWithRelationInputObjectSchema,
      GenresOnMovieOrderByWithRelationInputObjectSchema.array(),
    ])
    .optional(),
  where: GenresOnMovieWhereInputObjectSchema.optional(),
  cursor: GenresOnMovieWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  _count: z
    .union([z.literal(true), GenresOnMovieCountAggregateInputObjectSchema])
    .optional(),
  _min: GenresOnMovieMinAggregateInputObjectSchema.optional(),
  _max: GenresOnMovieMaxAggregateInputObjectSchema.optional(),
  _avg: GenresOnMovieAvgAggregateInputObjectSchema.optional(),
  _sum: GenresOnMovieSumAggregateInputObjectSchema.optional(),
});
