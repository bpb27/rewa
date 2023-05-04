import { z } from 'zod';
import { GenresOnMovieScalarWhereInputObjectSchema } from './GenresOnMovieScalarWhereInput.schema';
import { GenresOnMovieUpdateManyMutationInputObjectSchema } from './GenresOnMovieUpdateManyMutationInput.schema';
import { GenresOnMovieUncheckedUpdateManyWithoutGenresInputObjectSchema } from './GenresOnMovieUncheckedUpdateManyWithoutGenresInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieUpdateManyWithWhereWithoutMovieInput> =
  z
    .object({
      where: z.lazy(() => GenresOnMovieScalarWhereInputObjectSchema),
      data: z.union([
        z.lazy(() => GenresOnMovieUpdateManyMutationInputObjectSchema),
        z.lazy(
          () => GenresOnMovieUncheckedUpdateManyWithoutGenresInputObjectSchema,
        ),
      ]),
    })
    .strict();

export const GenresOnMovieUpdateManyWithWhereWithoutMovieInputObjectSchema =
  Schema;
