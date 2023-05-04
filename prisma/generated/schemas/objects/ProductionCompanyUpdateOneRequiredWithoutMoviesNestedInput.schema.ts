import { z } from 'zod';
import { ProductionCompanyCreateWithoutMoviesInputObjectSchema } from './ProductionCompanyCreateWithoutMoviesInput.schema';
import { ProductionCompanyUncheckedCreateWithoutMoviesInputObjectSchema } from './ProductionCompanyUncheckedCreateWithoutMoviesInput.schema';
import { ProductionCompanyCreateOrConnectWithoutMoviesInputObjectSchema } from './ProductionCompanyCreateOrConnectWithoutMoviesInput.schema';
import { ProductionCompanyUpsertWithoutMoviesInputObjectSchema } from './ProductionCompanyUpsertWithoutMoviesInput.schema';
import { ProductionCompanyWhereUniqueInputObjectSchema } from './ProductionCompanyWhereUniqueInput.schema';
import { ProductionCompanyUpdateWithoutMoviesInputObjectSchema } from './ProductionCompanyUpdateWithoutMoviesInput.schema';
import { ProductionCompanyUncheckedUpdateWithoutMoviesInputObjectSchema } from './ProductionCompanyUncheckedUpdateWithoutMoviesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyUpdateOneRequiredWithoutMoviesNestedInput> =
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
      upsert: z
        .lazy(() => ProductionCompanyUpsertWithoutMoviesInputObjectSchema)
        .optional(),
      connect: z
        .lazy(() => ProductionCompanyWhereUniqueInputObjectSchema)
        .optional(),
      update: z
        .union([
          z.lazy(() => ProductionCompanyUpdateWithoutMoviesInputObjectSchema),
          z.lazy(
            () =>
              ProductionCompanyUncheckedUpdateWithoutMoviesInputObjectSchema,
          ),
        ])
        .optional(),
    })
    .strict();

export const ProductionCompanyUpdateOneRequiredWithoutMoviesNestedInputObjectSchema =
  Schema;
