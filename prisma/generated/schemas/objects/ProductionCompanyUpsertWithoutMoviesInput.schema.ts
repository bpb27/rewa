import { z } from 'zod';
import { ProductionCompanyUpdateWithoutMoviesInputObjectSchema } from './ProductionCompanyUpdateWithoutMoviesInput.schema';
import { ProductionCompanyUncheckedUpdateWithoutMoviesInputObjectSchema } from './ProductionCompanyUncheckedUpdateWithoutMoviesInput.schema';
import { ProductionCompanyCreateWithoutMoviesInputObjectSchema } from './ProductionCompanyCreateWithoutMoviesInput.schema';
import { ProductionCompanyUncheckedCreateWithoutMoviesInputObjectSchema } from './ProductionCompanyUncheckedCreateWithoutMoviesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyUpsertWithoutMoviesInput> = z
  .object({
    update: z.union([
      z.lazy(() => ProductionCompanyUpdateWithoutMoviesInputObjectSchema),
      z.lazy(
        () => ProductionCompanyUncheckedUpdateWithoutMoviesInputObjectSchema,
      ),
    ]),
    create: z.union([
      z.lazy(() => ProductionCompanyCreateWithoutMoviesInputObjectSchema),
      z.lazy(
        () => ProductionCompanyUncheckedCreateWithoutMoviesInputObjectSchema,
      ),
    ]),
  })
  .strict();

export const ProductionCompanyUpsertWithoutMoviesInputObjectSchema = Schema;
