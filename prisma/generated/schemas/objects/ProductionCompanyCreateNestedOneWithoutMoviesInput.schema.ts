import { z } from 'zod';
import { ProductionCompanyCreateWithoutMoviesInputObjectSchema } from './ProductionCompanyCreateWithoutMoviesInput.schema';
import { ProductionCompanyUncheckedCreateWithoutMoviesInputObjectSchema } from './ProductionCompanyUncheckedCreateWithoutMoviesInput.schema';
import { ProductionCompanyCreateOrConnectWithoutMoviesInputObjectSchema } from './ProductionCompanyCreateOrConnectWithoutMoviesInput.schema';
import { ProductionCompanyWhereUniqueInputObjectSchema } from './ProductionCompanyWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyCreateNestedOneWithoutMoviesInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => ProductionCompanyCreateWithoutMoviesInputObjectSchema),
          z.lazy(
            () =>
              ProductionCompanyUncheckedCreateWithoutMoviesInputObjectSchema,
          ),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(
          () => ProductionCompanyCreateOrConnectWithoutMoviesInputObjectSchema,
        )
        .optional(),
      connect: z
        .lazy(() => ProductionCompanyWhereUniqueInputObjectSchema)
        .optional(),
    })
    .strict();

export const ProductionCompanyCreateNestedOneWithoutMoviesInputObjectSchema =
  Schema;
