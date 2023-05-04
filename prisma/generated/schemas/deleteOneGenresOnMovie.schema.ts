import { z } from 'zod';
import { GenresOnMovieWhereUniqueInputObjectSchema } from './objects/GenresOnMovieWhereUniqueInput.schema';

export const GenresOnMovieDeleteOneSchema = z.object({
  where: GenresOnMovieWhereUniqueInputObjectSchema,
});
