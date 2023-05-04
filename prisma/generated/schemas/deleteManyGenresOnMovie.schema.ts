import { z } from 'zod';
import { GenresOnMovieWhereInputObjectSchema } from './objects/GenresOnMovieWhereInput.schema';

export const GenresOnMovieDeleteManySchema = z.object({
  where: GenresOnMovieWhereInputObjectSchema.optional(),
});
