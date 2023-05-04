import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyUncheckedCreateWithoutMoviesInput> =
  z
    .object({
      id: z.number(),
      logo_path: z.string().optional().nullable(),
      name: z.string(),
      origin_country: z.string(),
    })
    .strict();

export const ProductionCompanyUncheckedCreateWithoutMoviesInputObjectSchema =
  Schema;
