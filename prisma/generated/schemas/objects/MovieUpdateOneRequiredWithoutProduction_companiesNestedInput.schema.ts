import { z } from 'zod';
import { MovieCreateWithoutProduction_companiesInputObjectSchema } from './MovieCreateWithoutProduction_companiesInput.schema';
import { MovieUncheckedCreateWithoutProduction_companiesInputObjectSchema } from './MovieUncheckedCreateWithoutProduction_companiesInput.schema';
import { MovieCreateOrConnectWithoutProduction_companiesInputObjectSchema } from './MovieCreateOrConnectWithoutProduction_companiesInput.schema';
import { MovieUpsertWithoutProduction_companiesInputObjectSchema } from './MovieUpsertWithoutProduction_companiesInput.schema';
import { MovieWhereUniqueInputObjectSchema } from './MovieWhereUniqueInput.schema';
import { MovieUpdateWithoutProduction_companiesInputObjectSchema } from './MovieUpdateWithoutProduction_companiesInput.schema';
import { MovieUncheckedUpdateWithoutProduction_companiesInputObjectSchema } from './MovieUncheckedUpdateWithoutProduction_companiesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.MovieUpdateOneRequiredWithoutProduction_companiesNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => MovieCreateWithoutProduction_companiesInputObjectSchema),
          z.lazy(
            () =>
              MovieUncheckedCreateWithoutProduction_companiesInputObjectSchema,
          ),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(
          () =>
            MovieCreateOrConnectWithoutProduction_companiesInputObjectSchema,
        )
        .optional(),
      upsert: z
        .lazy(() => MovieUpsertWithoutProduction_companiesInputObjectSchema)
        .optional(),
      connect: z.lazy(() => MovieWhereUniqueInputObjectSchema).optional(),
      update: z
        .union([
          z.lazy(() => MovieUpdateWithoutProduction_companiesInputObjectSchema),
          z.lazy(
            () =>
              MovieUncheckedUpdateWithoutProduction_companiesInputObjectSchema,
          ),
        ])
        .optional(),
    })
    .strict();

export const MovieUpdateOneRequiredWithoutProduction_companiesNestedInputObjectSchema =
  Schema;
