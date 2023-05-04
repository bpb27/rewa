import { z } from 'zod';
import { GenresOnMovieWhereUniqueInputObjectSchema } from './GenresOnMovieWhereUniqueInput.schema';
import { GenresOnMovieCreateWithoutGenreInputObjectSchema } from './GenresOnMovieCreateWithoutGenreInput.schema';
import { GenresOnMovieUncheckedCreateWithoutGenreInputObjectSchema } from './GenresOnMovieUncheckedCreateWithoutGenreInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieCreateOrConnectWithoutGenreInput> =
  z
    .object({
      where: z.lazy(() => GenresOnMovieWhereUniqueInputObjectSchema),
      create: z.union([
        z.lazy(() => GenresOnMovieCreateWithoutGenreInputObjectSchema),
        z.lazy(() => GenresOnMovieUncheckedCreateWithoutGenreInputObjectSchema),
      ]),
    })
    .strict();

export const GenresOnMovieCreateOrConnectWithoutGenreInputObjectSchema = Schema;
