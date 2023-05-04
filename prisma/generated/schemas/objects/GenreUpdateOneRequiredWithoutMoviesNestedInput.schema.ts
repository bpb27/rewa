import { z } from 'zod';
import { GenreCreateWithoutMoviesInputObjectSchema } from './GenreCreateWithoutMoviesInput.schema';
import { GenreUncheckedCreateWithoutMoviesInputObjectSchema } from './GenreUncheckedCreateWithoutMoviesInput.schema';
import { GenreCreateOrConnectWithoutMoviesInputObjectSchema } from './GenreCreateOrConnectWithoutMoviesInput.schema';
import { GenreUpsertWithoutMoviesInputObjectSchema } from './GenreUpsertWithoutMoviesInput.schema';
import { GenreWhereUniqueInputObjectSchema } from './GenreWhereUniqueInput.schema';
import { GenreUpdateWithoutMoviesInputObjectSchema } from './GenreUpdateWithoutMoviesInput.schema';
import { GenreUncheckedUpdateWithoutMoviesInputObjectSchema } from './GenreUncheckedUpdateWithoutMoviesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenreUpdateOneRequiredWithoutMoviesNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => GenreCreateWithoutMoviesInputObjectSchema),
          z.lazy(() => GenreUncheckedCreateWithoutMoviesInputObjectSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => GenreCreateOrConnectWithoutMoviesInputObjectSchema)
        .optional(),
      upsert: z
        .lazy(() => GenreUpsertWithoutMoviesInputObjectSchema)
        .optional(),
      connect: z.lazy(() => GenreWhereUniqueInputObjectSchema).optional(),
      update: z
        .union([
          z.lazy(() => GenreUpdateWithoutMoviesInputObjectSchema),
          z.lazy(() => GenreUncheckedUpdateWithoutMoviesInputObjectSchema),
        ])
        .optional(),
    })
    .strict();

export const GenreUpdateOneRequiredWithoutMoviesNestedInputObjectSchema =
  Schema;
