import { z } from 'zod';
import { MovieCreateWithoutProduction_companiesInputObjectSchema } from './MovieCreateWithoutProduction_companiesInput.schema';
import { MovieUncheckedCreateWithoutProduction_companiesInputObjectSchema } from './MovieUncheckedCreateWithoutProduction_companiesInput.schema';
import { MovieCreateOrConnectWithoutProduction_companiesInputObjectSchema } from './MovieCreateOrConnectWithoutProduction_companiesInput.schema';
import { MovieWhereUniqueInputObjectSchema } from './MovieWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.MovieCreateNestedOneWithoutProduction_companiesInput> =
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
      connect: z.lazy(() => MovieWhereUniqueInputObjectSchema).optional(),
    })
    .strict();

export const MovieCreateNestedOneWithoutProduction_companiesInputObjectSchema =
  Schema;
