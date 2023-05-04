import { z } from 'zod';
import { MovieCreateWithoutGenresInputObjectSchema } from './MovieCreateWithoutGenresInput.schema';
import { MovieUncheckedCreateWithoutGenresInputObjectSchema } from './MovieUncheckedCreateWithoutGenresInput.schema';
import { MovieCreateOrConnectWithoutGenresInputObjectSchema } from './MovieCreateOrConnectWithoutGenresInput.schema';
import { MovieUpsertWithoutGenresInputObjectSchema } from './MovieUpsertWithoutGenresInput.schema';
import { MovieWhereUniqueInputObjectSchema } from './MovieWhereUniqueInput.schema';
import { MovieUpdateWithoutGenresInputObjectSchema } from './MovieUpdateWithoutGenresInput.schema';
import { MovieUncheckedUpdateWithoutGenresInputObjectSchema } from './MovieUncheckedUpdateWithoutGenresInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.MovieUpdateOneRequiredWithoutGenresNestedInput> =
  z
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
      upsert: z
        .lazy(() => MovieUpsertWithoutGenresInputObjectSchema)
        .optional(),
      connect: z.lazy(() => MovieWhereUniqueInputObjectSchema).optional(),
      update: z
        .union([
          z.lazy(() => MovieUpdateWithoutGenresInputObjectSchema),
          z.lazy(() => MovieUncheckedUpdateWithoutGenresInputObjectSchema),
        ])
        .optional(),
    })
    .strict();

export const MovieUpdateOneRequiredWithoutGenresNestedInputObjectSchema =
  Schema;
