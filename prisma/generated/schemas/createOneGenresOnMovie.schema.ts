import { z } from 'zod';
import { GenresOnMovieCreateInputObjectSchema } from './objects/GenresOnMovieCreateInput.schema';
import { GenresOnMovieUncheckedCreateInputObjectSchema } from './objects/GenresOnMovieUncheckedCreateInput.schema';

export const GenresOnMovieCreateOneSchema = z.object({
  data: z.union([
    GenresOnMovieCreateInputObjectSchema,
    GenresOnMovieUncheckedCreateInputObjectSchema,
  ]),
});
