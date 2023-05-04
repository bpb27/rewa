import { z } from 'zod';
import { GenresOnMovieOrderByWithRelationInputObjectSchema } from './objects/GenresOnMovieOrderByWithRelationInput.schema';
import { GenresOnMovieWhereInputObjectSchema } from './objects/GenresOnMovieWhereInput.schema';
import { GenresOnMovieWhereUniqueInputObjectSchema } from './objects/GenresOnMovieWhereUniqueInput.schema';
import { GenresOnMovieScalarFieldEnumSchema } from './enums/GenresOnMovieScalarFieldEnum.schema';

export const GenresOnMovieFindFirstSchema = z.object({
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
  distinct: z.array(GenresOnMovieScalarFieldEnumSchema).optional(),
});
