import { z } from 'zod';
import { MovieCreateWithoutCrewInputObjectSchema } from './MovieCreateWithoutCrewInput.schema';
import { MovieUncheckedCreateWithoutCrewInputObjectSchema } from './MovieUncheckedCreateWithoutCrewInput.schema';
import { MovieCreateOrConnectWithoutCrewInputObjectSchema } from './MovieCreateOrConnectWithoutCrewInput.schema';
import { MovieUpsertWithoutCrewInputObjectSchema } from './MovieUpsertWithoutCrewInput.schema';
import { MovieWhereUniqueInputObjectSchema } from './MovieWhereUniqueInput.schema';
import { MovieUpdateWithoutCrewInputObjectSchema } from './MovieUpdateWithoutCrewInput.schema';
import { MovieUncheckedUpdateWithoutCrewInputObjectSchema } from './MovieUncheckedUpdateWithoutCrewInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.MovieUpdateOneRequiredWithoutCrewNestedInput> = z
  .object({
    create: z
      .union([
        z.lazy(() => MovieCreateWithoutCrewInputObjectSchema),
        z.lazy(() => MovieUncheckedCreateWithoutCrewInputObjectSchema),
      ])
      .optional(),
    connectOrCreate: z
      .lazy(() => MovieCreateOrConnectWithoutCrewInputObjectSchema)
      .optional(),
    upsert: z.lazy(() => MovieUpsertWithoutCrewInputObjectSchema).optional(),
    connect: z.lazy(() => MovieWhereUniqueInputObjectSchema).optional(),
    update: z
      .union([
        z.lazy(() => MovieUpdateWithoutCrewInputObjectSchema),
        z.lazy(() => MovieUncheckedUpdateWithoutCrewInputObjectSchema),
      ])
      .optional(),
  })
  .strict();

export const MovieUpdateOneRequiredWithoutCrewNestedInputObjectSchema = Schema;
