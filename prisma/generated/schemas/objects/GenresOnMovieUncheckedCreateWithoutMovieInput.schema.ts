import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieUncheckedCreateWithoutMovieInput> =
  z
    .object({
      genreId: z.number(),
    })
    .strict();

export const GenresOnMovieUncheckedCreateWithoutMovieInputObjectSchema = Schema;
