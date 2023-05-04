import { z } from 'zod';
import { GenresOnMovieWhereUniqueInputObjectSchema } from './GenresOnMovieWhereUniqueInput.schema';
import { GenresOnMovieCreateWithoutMovieInputObjectSchema } from './GenresOnMovieCreateWithoutMovieInput.schema';
import { GenresOnMovieUncheckedCreateWithoutMovieInputObjectSchema } from './GenresOnMovieUncheckedCreateWithoutMovieInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieCreateOrConnectWithoutMovieInput> =
  z
    .object({
      where: z.lazy(() => GenresOnMovieWhereUniqueInputObjectSchema),
      create: z.union([
        z.lazy(() => GenresOnMovieCreateWithoutMovieInputObjectSchema),
        z.lazy(() => GenresOnMovieUncheckedCreateWithoutMovieInputObjectSchema),
      ]),
    })
    .strict();

export const GenresOnMovieCreateOrConnectWithoutMovieInputObjectSchema = Schema;
