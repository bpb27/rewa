import { z } from 'zod';
import { GenresOnMovieWhereUniqueInputObjectSchema } from './GenresOnMovieWhereUniqueInput.schema';
import { GenresOnMovieUpdateWithoutMovieInputObjectSchema } from './GenresOnMovieUpdateWithoutMovieInput.schema';
import { GenresOnMovieUncheckedUpdateWithoutMovieInputObjectSchema } from './GenresOnMovieUncheckedUpdateWithoutMovieInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieUpdateWithWhereUniqueWithoutMovieInput> =
  z
    .object({
      where: z.lazy(() => GenresOnMovieWhereUniqueInputObjectSchema),
      data: z.union([
        z.lazy(() => GenresOnMovieUpdateWithoutMovieInputObjectSchema),
        z.lazy(() => GenresOnMovieUncheckedUpdateWithoutMovieInputObjectSchema),
      ]),
    })
    .strict();

export const GenresOnMovieUpdateWithWhereUniqueWithoutMovieInputObjectSchema =
  Schema;
