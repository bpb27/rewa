import { z } from 'zod';
import { GenresOnMovieUpdateManyMutationInputObjectSchema } from './objects/GenresOnMovieUpdateManyMutationInput.schema';
import { GenresOnMovieWhereInputObjectSchema } from './objects/GenresOnMovieWhereInput.schema';

export const GenresOnMovieUpdateManySchema = z.object({
  data: GenresOnMovieUpdateManyMutationInputObjectSchema,
  where: GenresOnMovieWhereInputObjectSchema.optional(),
});
