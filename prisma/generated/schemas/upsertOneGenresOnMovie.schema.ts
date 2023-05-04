import { z } from 'zod';
import { GenresOnMovieWhereUniqueInputObjectSchema } from './objects/GenresOnMovieWhereUniqueInput.schema';
import { GenresOnMovieCreateInputObjectSchema } from './objects/GenresOnMovieCreateInput.schema';
import { GenresOnMovieUncheckedCreateInputObjectSchema } from './objects/GenresOnMovieUncheckedCreateInput.schema';
import { GenresOnMovieUpdateInputObjectSchema } from './objects/GenresOnMovieUpdateInput.schema';
import { GenresOnMovieUncheckedUpdateInputObjectSchema } from './objects/GenresOnMovieUncheckedUpdateInput.schema';

export const GenresOnMovieUpsertSchema = z.object({
  where: GenresOnMovieWhereUniqueInputObjectSchema,
  create: z.union([
    GenresOnMovieCreateInputObjectSchema,
    GenresOnMovieUncheckedCreateInputObjectSchema,
  ]),
  update: z.union([
    GenresOnMovieUpdateInputObjectSchema,
    GenresOnMovieUncheckedUpdateInputObjectSchema,
  ]),
});
