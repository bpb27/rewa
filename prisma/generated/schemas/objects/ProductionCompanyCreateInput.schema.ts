import { z } from 'zod';
import { ProductionCompanyOnMovieCreateNestedManyWithoutProductionCompanyInputObjectSchema } from './ProductionCompanyOnMovieCreateNestedManyWithoutProductionCompanyInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyCreateInput> = z
  .object({
    id: z.number(),
    logo_path: z.string().optional().nullable(),
    name: z.string(),
    origin_country: z.string(),
    movies: z
      .lazy(
        () =>
          ProductionCompanyOnMovieCreateNestedManyWithoutProductionCompanyInputObjectSchema,
      )
      .optional(),
  })
  .strict();

export const ProductionCompanyCreateInputObjectSchema = Schema;
