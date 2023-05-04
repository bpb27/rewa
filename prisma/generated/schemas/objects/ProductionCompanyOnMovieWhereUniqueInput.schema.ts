import { z } from 'zod';
import { ProductionCompanyOnMovieMovieIdProductionCompanyIdCompoundUniqueInputObjectSchema } from './ProductionCompanyOnMovieMovieIdProductionCompanyIdCompoundUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieWhereUniqueInput> = z
  .object({
    movieId_productionCompanyId: z
      .lazy(
        () =>
          ProductionCompanyOnMovieMovieIdProductionCompanyIdCompoundUniqueInputObjectSchema,
      )
      .optional(),
  })
  .strict();

export const ProductionCompanyOnMovieWhereUniqueInputObjectSchema = Schema;
