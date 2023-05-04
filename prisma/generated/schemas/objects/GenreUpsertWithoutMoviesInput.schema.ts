import { z } from 'zod';
import { GenreUpdateWithoutMoviesInputObjectSchema } from './GenreUpdateWithoutMoviesInput.schema';
import { GenreUncheckedUpdateWithoutMoviesInputObjectSchema } from './GenreUncheckedUpdateWithoutMoviesInput.schema';
import { GenreCreateWithoutMoviesInputObjectSchema } from './GenreCreateWithoutMoviesInput.schema';
import { GenreUncheckedCreateWithoutMoviesInputObjectSchema } from './GenreUncheckedCreateWithoutMoviesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenreUpsertWithoutMoviesInput> = z
  .object({
    update: z.union([
      z.lazy(() => GenreUpdateWithoutMoviesInputObjectSchema),
      z.lazy(() => GenreUncheckedUpdateWithoutMoviesInputObjectSchema),
    ]),
    create: z.union([
      z.lazy(() => GenreCreateWithoutMoviesInputObjectSchema),
      z.lazy(() => GenreUncheckedCreateWithoutMoviesInputObjectSchema),
    ]),
  })
  .strict();

export const GenreUpsertWithoutMoviesInputObjectSchema = Schema;
