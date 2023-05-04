import { z } from 'zod';
import { MovieUpdateWithoutGenresInputObjectSchema } from './MovieUpdateWithoutGenresInput.schema';
import { MovieUncheckedUpdateWithoutGenresInputObjectSchema } from './MovieUncheckedUpdateWithoutGenresInput.schema';
import { MovieCreateWithoutGenresInputObjectSchema } from './MovieCreateWithoutGenresInput.schema';
import { MovieUncheckedCreateWithoutGenresInputObjectSchema } from './MovieUncheckedCreateWithoutGenresInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.MovieUpsertWithoutGenresInput> = z
  .object({
    update: z.union([
      z.lazy(() => MovieUpdateWithoutGenresInputObjectSchema),
      z.lazy(() => MovieUncheckedUpdateWithoutGenresInputObjectSchema),
    ]),
    create: z.union([
      z.lazy(() => MovieCreateWithoutGenresInputObjectSchema),
      z.lazy(() => MovieUncheckedCreateWithoutGenresInputObjectSchema),
    ]),
  })
  .strict();

export const MovieUpsertWithoutGenresInputObjectSchema = Schema;
