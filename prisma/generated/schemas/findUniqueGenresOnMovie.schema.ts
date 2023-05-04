import { z } from 'zod';
import { GenresOnMovieWhereUniqueInputObjectSchema } from './objects/GenresOnMovieWhereUniqueInput.schema';

export const GenresOnMovieFindUniqueSchema = z.object({
  where: GenresOnMovieWhereUniqueInputObjectSchema,
});
