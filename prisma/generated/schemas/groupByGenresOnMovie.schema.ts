import { z } from 'zod';
import { GenresOnMovieWhereInputObjectSchema } from './objects/GenresOnMovieWhereInput.schema';
import { GenresOnMovieOrderByWithAggregationInputObjectSchema } from './objects/GenresOnMovieOrderByWithAggregationInput.schema';
import { GenresOnMovieScalarWhereWithAggregatesInputObjectSchema } from './objects/GenresOnMovieScalarWhereWithAggregatesInput.schema';
import { GenresOnMovieScalarFieldEnumSchema } from './enums/GenresOnMovieScalarFieldEnum.schema';

export const GenresOnMovieGroupBySchema = z.object({
  where: GenresOnMovieWhereInputObjectSchema.optional(),
  orderBy: z
    .union([
      GenresOnMovieOrderByWithAggregationInputObjectSchema,
      GenresOnMovieOrderByWithAggregationInputObjectSchema.array(),
    ])
    .optional(),
  having: GenresOnMovieScalarWhereWithAggregatesInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  by: z.array(GenresOnMovieScalarFieldEnumSchema),
});
