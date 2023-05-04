import { z } from 'zod';
import { GenresOnMovieWhereUniqueInputObjectSchema } from './GenresOnMovieWhereUniqueInput.schema';
import { GenresOnMovieUpdateWithoutMovieInputObjectSchema } from './GenresOnMovieUpdateWithoutMovieInput.schema';
import { GenresOnMovieUncheckedUpdateWithoutMovieInputObjectSchema } from './GenresOnMovieUncheckedUpdateWithoutMovieInput.schema';
import { GenresOnMovieCreateWithoutMovieInputObjectSchema } from './GenresOnMovieCreateWithoutMovieInput.schema';
import { GenresOnMovieUncheckedCreateWithoutMovieInputObjectSchema } from './GenresOnMovieUncheckedCreateWithoutMovieInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieUpsertWithWhereUniqueWithoutMovieInput> =
  z
    .object({
      where: z.lazy(() => GenresOnMovieWhereUniqueInputObjectSchema),
      update: z.union([
        z.lazy(() => GenresOnMovieUpdateWithoutMovieInputObjectSchema),
        z.lazy(() => GenresOnMovieUncheckedUpdateWithoutMovieInputObjectSchema),
      ]),
      create: z.union([
        z.lazy(() => GenresOnMovieCreateWithoutMovieInputObjectSchema),
        z.lazy(() => GenresOnMovieUncheckedCreateWithoutMovieInputObjectSchema),
      ]),
    })
    .strict();

export const GenresOnMovieUpsertWithWhereUniqueWithoutMovieInputObjectSchema =
  Schema;
