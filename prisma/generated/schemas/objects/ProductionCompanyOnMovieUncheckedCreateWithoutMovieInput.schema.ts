import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieUncheckedCreateWithoutMovieInput> =
  z
    .object({
      productionCompanyId: z.number(),
    })
    .strict();

export const ProductionCompanyOnMovieUncheckedCreateWithoutMovieInputObjectSchema =
  Schema;
