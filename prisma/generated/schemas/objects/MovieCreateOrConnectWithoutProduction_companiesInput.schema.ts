import { z } from 'zod';
import { MovieWhereUniqueInputObjectSchema } from './MovieWhereUniqueInput.schema';
import { MovieCreateWithoutProduction_companiesInputObjectSchema } from './MovieCreateWithoutProduction_companiesInput.schema';
import { MovieUncheckedCreateWithoutProduction_companiesInputObjectSchema } from './MovieUncheckedCreateWithoutProduction_companiesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.MovieCreateOrConnectWithoutProduction_companiesInput> =
  z
    .object({
      where: z.lazy(() => MovieWhereUniqueInputObjectSchema),
      create: z.union([
        z.lazy(() => MovieCreateWithoutProduction_companiesInputObjectSchema),
        z.lazy(
          () =>
            MovieUncheckedCreateWithoutProduction_companiesInputObjectSchema,
        ),
      ]),
    })
    .strict();

export const MovieCreateOrConnectWithoutProduction_companiesInputObjectSchema =
  Schema;
