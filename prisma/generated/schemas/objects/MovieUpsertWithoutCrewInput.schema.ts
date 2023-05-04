import { z } from 'zod';
import { MovieUpdateWithoutCrewInputObjectSchema } from './MovieUpdateWithoutCrewInput.schema';
import { MovieUncheckedUpdateWithoutCrewInputObjectSchema } from './MovieUncheckedUpdateWithoutCrewInput.schema';
import { MovieCreateWithoutCrewInputObjectSchema } from './MovieCreateWithoutCrewInput.schema';
import { MovieUncheckedCreateWithoutCrewInputObjectSchema } from './MovieUncheckedCreateWithoutCrewInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.MovieUpsertWithoutCrewInput> = z
  .object({
    update: z.union([
      z.lazy(() => MovieUpdateWithoutCrewInputObjectSchema),
      z.lazy(() => MovieUncheckedUpdateWithoutCrewInputObjectSchema),
    ]),
    create: z.union([
      z.lazy(() => MovieCreateWithoutCrewInputObjectSchema),
      z.lazy(() => MovieUncheckedCreateWithoutCrewInputObjectSchema),
    ]),
  })
  .strict();

export const MovieUpsertWithoutCrewInputObjectSchema = Schema;
