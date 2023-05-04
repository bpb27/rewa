import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { MovieRelationFilterObjectSchema } from './MovieRelationFilter.schema';
import { MovieWhereInputObjectSchema } from './MovieWhereInput.schema';
import { ProductionCompanyRelationFilterObjectSchema } from './ProductionCompanyRelationFilter.schema';
import { ProductionCompanyWhereInputObjectSchema } from './ProductionCompanyWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => ProductionCompanyOnMovieWhereInputObjectSchema),
        z.lazy(() => ProductionCompanyOnMovieWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => ProductionCompanyOnMovieWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => ProductionCompanyOnMovieWhereInputObjectSchema),
        z.lazy(() => ProductionCompanyOnMovieWhereInputObjectSchema).array(),
      ])
      .optional(),
    movieId: z
      .union([z.lazy(() => IntFilterObjectSchema), z.number()])
      .optional(),
    productionCompanyId: z
      .union([z.lazy(() => IntFilterObjectSchema), z.number()])
      .optional(),
    movie: z
      .union([
        z.lazy(() => MovieRelationFilterObjectSchema),
        z.lazy(() => MovieWhereInputObjectSchema),
      ])
      .optional(),
    productionCompany: z
      .union([
        z.lazy(() => ProductionCompanyRelationFilterObjectSchema),
        z.lazy(() => ProductionCompanyWhereInputObjectSchema),
      ])
      .optional(),
  })
  .strict();

export const ProductionCompanyOnMovieWhereInputObjectSchema = Schema;
