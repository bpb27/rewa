import { z } from 'zod';
import { ProductionCompanyOnMovieUncheckedCreateNestedManyWithoutProductionCompanyInputObjectSchema } from './ProductionCompanyOnMovieUncheckedCreateNestedManyWithoutProductionCompanyInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyUncheckedCreateInput> = z
  .object({
    id: z.number(),
    logo_path: z.string().optional().nullable(),
    name: z.string(),
    origin_country: z.string(),
    movies: z
      .lazy(
        () =>
          ProductionCompanyOnMovieUncheckedCreateNestedManyWithoutProductionCompanyInputObjectSchema,
      )
      .optional(),
  })
  .strict();

export const ProductionCompanyUncheckedCreateInputObjectSchema = Schema;
