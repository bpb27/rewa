import { z } from 'zod';
import { MovieWhereUniqueInputObjectSchema } from './MovieWhereUniqueInput.schema';
import { MovieCreateWithoutCrewInputObjectSchema } from './MovieCreateWithoutCrewInput.schema';
import { MovieUncheckedCreateWithoutCrewInputObjectSchema } from './MovieUncheckedCreateWithoutCrewInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.MovieCreateOrConnectWithoutCrewInput> = z
  .object({
    where: z.lazy(() => MovieWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => MovieCreateWithoutCrewInputObjectSchema),
      z.lazy(() => MovieUncheckedCreateWithoutCrewInputObjectSchema),
    ]),
  })
  .strict();

export const MovieCreateOrConnectWithoutCrewInputObjectSchema = Schema;
