import { z } from 'zod';
import { IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(
            () =>
              ProductionCompanyOnMovieScalarWhereWithAggregatesInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                ProductionCompanyOnMovieScalarWhereWithAggregatesInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      OR: z
        .lazy(
          () =>
            ProductionCompanyOnMovieScalarWhereWithAggregatesInputObjectSchema,
        )
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(
            () =>
              ProductionCompanyOnMovieScalarWhereWithAggregatesInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                ProductionCompanyOnMovieScalarWhereWithAggregatesInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      movieId: z
        .union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number()])
        .optional(),
      productionCompanyId: z
        .union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number()])
        .optional(),
    })
    .strict();

export const ProductionCompanyOnMovieScalarWhereWithAggregatesInputObjectSchema =
  Schema;
