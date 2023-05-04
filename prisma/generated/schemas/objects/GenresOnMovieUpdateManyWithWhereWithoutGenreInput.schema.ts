import { z } from 'zod';
import { GenresOnMovieScalarWhereInputObjectSchema } from './GenresOnMovieScalarWhereInput.schema';
import { GenresOnMovieUpdateManyMutationInputObjectSchema } from './GenresOnMovieUpdateManyMutationInput.schema';
import { GenresOnMovieUncheckedUpdateManyWithoutMoviesInputObjectSchema } from './GenresOnMovieUncheckedUpdateManyWithoutMoviesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieUpdateManyWithWhereWithoutGenreInput> =
  z
    .object({
      where: z.lazy(() => GenresOnMovieScalarWhereInputObjectSchema),
      data: z.union([
        z.lazy(() => GenresOnMovieUpdateManyMutationInputObjectSchema),
        z.lazy(
          () => GenresOnMovieUncheckedUpdateManyWithoutMoviesInputObjectSchema,
        ),
      ]),
    })
    .strict();

export const GenresOnMovieUpdateManyWithWhereWithoutGenreInputObjectSchema =
  Schema;
