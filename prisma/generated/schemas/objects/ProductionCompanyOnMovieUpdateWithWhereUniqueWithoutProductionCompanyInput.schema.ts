import { z } from 'zod';
import { ProductionCompanyOnMovieWhereUniqueInputObjectSchema } from './ProductionCompanyOnMovieWhereUniqueInput.schema';
import { ProductionCompanyOnMovieUpdateWithoutProductionCompanyInputObjectSchema } from './ProductionCompanyOnMovieUpdateWithoutProductionCompanyInput.schema';
import { ProductionCompanyOnMovieUncheckedUpdateWithoutProductionCompanyInputObjectSchema } from './ProductionCompanyOnMovieUncheckedUpdateWithoutProductionCompanyInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieUpdateWithWhereUniqueWithoutProductionCompanyInput> =
  z
    .object({
      where: z.lazy(() => ProductionCompanyOnMovieWhereUniqueInputObjectSchema),
      data: z.union([
        z.lazy(
          () =>
            ProductionCompanyOnMovieUpdateWithoutProductionCompanyInputObjectSchema,
        ),
        z.lazy(
          () =>
            ProductionCompanyOnMovieUncheckedUpdateWithoutProductionCompanyInputObjectSchema,
        ),
      ]),
    })
    .strict();

export const ProductionCompanyOnMovieUpdateWithWhereUniqueWithoutProductionCompanyInputObjectSchema =
  Schema;
