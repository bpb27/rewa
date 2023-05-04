import { z } from 'zod';
import { MovieCreateWithoutCrewInputObjectSchema } from './MovieCreateWithoutCrewInput.schema';
import { MovieUncheckedCreateWithoutCrewInputObjectSchema } from './MovieUncheckedCreateWithoutCrewInput.schema';
import { MovieCreateOrConnectWithoutCrewInputObjectSchema } from './MovieCreateOrConnectWithoutCrewInput.schema';
import { MovieWhereUniqueInputObjectSchema } from './MovieWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.MovieCreateNestedOneWithoutCrewInput> = z
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
    connect: z.lazy(() => MovieWhereUniqueInputObjectSchema).optional(),
  })
  .strict();

export const MovieCreateNestedOneWithoutCrewInputObjectSchema = Schema;
