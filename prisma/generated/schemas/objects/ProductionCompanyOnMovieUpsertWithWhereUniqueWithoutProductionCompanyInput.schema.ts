import { z } from 'zod';
import { ProductionCompanyOnMovieWhereUniqueInputObjectSchema } from './ProductionCompanyOnMovieWhereUniqueInput.schema';
import { ProductionCompanyOnMovieUpdateWithoutProductionCompanyInputObjectSchema } from './ProductionCompanyOnMovieUpdateWithoutProductionCompanyInput.schema';
import { ProductionCompanyOnMovieUncheckedUpdateWithoutProductionCompanyInputObjectSchema } from './ProductionCompanyOnMovieUncheckedUpdateWithoutProductionCompanyInput.schema';
import { ProductionCompanyOnMovieCreateWithoutProductionCompanyInputObjectSchema } from './ProductionCompanyOnMovieCreateWithoutProductionCompanyInput.schema';
import { ProductionCompanyOnMovieUncheckedCreateWithoutProductionCompanyInputObjectSchema } from './ProductionCompanyOnMovieUncheckedCreateWithoutProductionCompanyInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieUpsertWithWhereUniqueWithoutProductionCompanyInput> =
  z
    .object({
      where: z.lazy(() => ProductionCompanyOnMovieWhereUniqueInputObjectSchema),
      update: z.union([
        z.lazy(
          () =>
            ProductionCompanyOnMovieUpdateWithoutProductionCompanyInputObjectSchema,
        ),
        z.lazy(
          () =>
            ProductionCompanyOnMovieUncheckedUpdateWithoutProductionCompanyInputObjectSchema,
        ),
      ]),
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

export const ProductionCompanyOnMovieUpsertWithWhereUniqueWithoutProductionCompanyInputObjectSchema =
  Schema;
