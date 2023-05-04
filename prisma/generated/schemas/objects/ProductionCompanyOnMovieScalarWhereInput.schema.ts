import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieScalarWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => ProductionCompanyOnMovieScalarWhereInputObjectSchema),
        z
          .lazy(() => ProductionCompanyOnMovieScalarWhereInputObjectSchema)
          .array(),
      ])
      .optional(),
    OR: z
      .lazy(() => ProductionCompanyOnMovieScalarWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => ProductionCompanyOnMovieScalarWhereInputObjectSchema),
        z
          .lazy(() => ProductionCompanyOnMovieScalarWhereInputObjectSchema)
          .array(),
      ])
      .optional(),
    movieId: z
      .union([z.lazy(() => IntFilterObjectSchema), z.number()])
      .optional(),
    productionCompanyId: z
      .union([z.lazy(() => IntFilterObjectSchema), z.number()])
      .optional(),
  })
  .strict();

export const ProductionCompanyOnMovieScalarWhereInputObjectSchema = Schema;
