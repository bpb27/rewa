import { z } from 'zod';
import { MovieCreateWithoutGenresInputObjectSchema } from './MovieCreateWithoutGenresInput.schema';
import { MovieUncheckedCreateWithoutGenresInputObjectSchema } from './MovieUncheckedCreateWithoutGenresInput.schema';
import { MovieCreateOrConnectWithoutGenresInputObjectSchema } from './MovieCreateOrConnectWithoutGenresInput.schema';
import { MovieWhereUniqueInputObjectSchema } from './MovieWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.MovieCreateNestedOneWithoutGenresInput> = z
  .object({
    create: z
      .union([
        z.lazy(() => MovieCreateWithoutGenresInputObjectSchema),
        z.lazy(() => MovieUncheckedCreateWithoutGenresInputObjectSchema),
      ])
      .optional(),
    connectOrCreate: z
      .lazy(() => MovieCreateOrConnectWithoutGenresInputObjectSchema)
      .optional(),
    connect: z.lazy(() => MovieWhereUniqueInputObjectSchema).optional(),
  })
  .strict();

export const MovieCreateNestedOneWithoutGenresInputObjectSchema = Schema;
