import { z } from 'zod';
import { MovieUpdateWithoutProduction_companiesInputObjectSchema } from './MovieUpdateWithoutProduction_companiesInput.schema';
import { MovieUncheckedUpdateWithoutProduction_companiesInputObjectSchema } from './MovieUncheckedUpdateWithoutProduction_companiesInput.schema';
import { MovieCreateWithoutProduction_companiesInputObjectSchema } from './MovieCreateWithoutProduction_companiesInput.schema';
import { MovieUncheckedCreateWithoutProduction_companiesInputObjectSchema } from './MovieUncheckedCreateWithoutProduction_companiesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.MovieUpsertWithoutProduction_companiesInput> = z
  .object({
    update: z.union([
      z.lazy(() => MovieUpdateWithoutProduction_companiesInputObjectSchema),
      z.lazy(
        () => MovieUncheckedUpdateWithoutProduction_companiesInputObjectSchema,
      ),
    ]),
    create: z.union([
      z.lazy(() => MovieCreateWithoutProduction_companiesInputObjectSchema),
      z.lazy(
        () => MovieUncheckedCreateWithoutProduction_companiesInputObjectSchema,
      ),
    ]),
  })
  .strict();

export const MovieUpsertWithoutProduction_companiesInputObjectSchema = Schema;
