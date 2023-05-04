import { z } from 'zod';
import { ProductionCompanyWhereUniqueInputObjectSchema } from './ProductionCompanyWhereUniqueInput.schema';
import { ProductionCompanyCreateWithoutMoviesInputObjectSchema } from './ProductionCompanyCreateWithoutMoviesInput.schema';
import { ProductionCompanyUncheckedCreateWithoutMoviesInputObjectSchema } from './ProductionCompanyUncheckedCreateWithoutMoviesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyCreateOrConnectWithoutMoviesInput> =
  z
    .object({
      where: z.lazy(() => ProductionCompanyWhereUniqueInputObjectSchema),
      create: z.union([
        z.lazy(() => ProductionCompanyCreateWithoutMoviesInputObjectSchema),
        z.lazy(
          () => ProductionCompanyUncheckedCreateWithoutMoviesInputObjectSchema,
        ),
      ]),
    })
    .strict();

export const ProductionCompanyCreateOrConnectWithoutMoviesInputObjectSchema =
  Schema;
