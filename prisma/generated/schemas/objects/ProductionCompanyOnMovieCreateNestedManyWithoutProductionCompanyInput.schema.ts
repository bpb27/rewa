import { z } from 'zod';
import { ProductionCompanyOnMovieCreateWithoutProductionCompanyInputObjectSchema } from './ProductionCompanyOnMovieCreateWithoutProductionCompanyInput.schema';
import { ProductionCompanyOnMovieUncheckedCreateWithoutProductionCompanyInputObjectSchema } from './ProductionCompanyOnMovieUncheckedCreateWithoutProductionCompanyInput.schema';
import { ProductionCompanyOnMovieCreateOrConnectWithoutProductionCompanyInputObjectSchema } from './ProductionCompanyOnMovieCreateOrConnectWithoutProductionCompanyInput.schema';
import { ProductionCompanyOnMovieWhereUniqueInputObjectSchema } from './ProductionCompanyOnMovieWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieCreateNestedManyWithoutProductionCompanyInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(
            () =>
              ProductionCompanyOnMovieCreateWithoutProductionCompanyInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                ProductionCompanyOnMovieCreateWithoutProductionCompanyInputObjectSchema,
            )
            .array(),
          z.lazy(
            () =>
              ProductionCompanyOnMovieUncheckedCreateWithoutProductionCompanyInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                ProductionCompanyOnMovieUncheckedCreateWithoutProductionCompanyInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () =>
              ProductionCompanyOnMovieCreateOrConnectWithoutProductionCompanyInputObjectSchema,
          ),
          z
            .lazy(
              () =>
                ProductionCompanyOnMovieCreateOrConnectWithoutProductionCompanyInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => ProductionCompanyOnMovieWhereUniqueInputObjectSchema),
          z
            .lazy(() => ProductionCompanyOnMovieWhereUniqueInputObjectSchema)
            .array(),
        ])
        .optional(),
    })
    .strict();

export const ProductionCompanyOnMovieCreateNestedManyWithoutProductionCompanyInputObjectSchema =
  Schema;
