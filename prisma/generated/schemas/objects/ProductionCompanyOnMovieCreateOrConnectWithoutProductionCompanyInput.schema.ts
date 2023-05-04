import { z } from 'zod';
import { ProductionCompanyOnMovieWhereUniqueInputObjectSchema } from './ProductionCompanyOnMovieWhereUniqueInput.schema';
import { ProductionCompanyOnMovieCreateWithoutProductionCompanyInputObjectSchema } from './ProductionCompanyOnMovieCreateWithoutProductionCompanyInput.schema';
import { ProductionCompanyOnMovieUncheckedCreateWithoutProductionCompanyInputObjectSchema } from './ProductionCompanyOnMovieUncheckedCreateWithoutProductionCompanyInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieCreateOrConnectWithoutProductionCompanyInput> =
  z
    .object({
      where: z.lazy(() => ProductionCompanyOnMovieWhereUniqueInputObjectSchema),
      create: z.union([
        z.lazy(
          () =>
            ProductionCompanyOnMovieCreateWithoutProductionCompanyInputObjectSchema,
        ),
        z.lazy(
          () =>
            ProductionCompanyOnMovieUncheckedCreateWithoutProductionCompanyInputObjectSchema,
        ),
      ]),
    })
    .strict();

export const ProductionCompanyOnMovieCreateOrConnectWithoutProductionCompanyInputObjectSchema =
  Schema;
