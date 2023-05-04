import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieMovieIdProductionCompanyIdCompoundUniqueInput> =
  z
    .object({
      movieId: z.number(),
      productionCompanyId: z.number(),
    })
    .strict();

export const ProductionCompanyOnMovieMovieIdProductionCompanyIdCompoundUniqueInputObjectSchema =
  Schema;
