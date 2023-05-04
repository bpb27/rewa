import { z } from 'zod';
import { GenresOnMovieUpdateInputObjectSchema } from './objects/GenresOnMovieUpdateInput.schema';
import { GenresOnMovieUncheckedUpdateInputObjectSchema } from './objects/GenresOnMovieUncheckedUpdateInput.schema';
import { GenresOnMovieWhereUniqueInputObjectSchema } from './objects/GenresOnMovieWhereUniqueInput.schema';

export const GenresOnMovieUpdateOneSchema = z.object({
  data: z.union([
    GenresOnMovieUpdateInputObjectSchema,
    GenresOnMovieUncheckedUpdateInputObjectSchema,
  ]),
  where: GenresOnMovieWhereUniqueInputObjectSchema,
});
