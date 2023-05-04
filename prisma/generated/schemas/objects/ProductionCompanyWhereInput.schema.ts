import { z } from 'zod';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { ProductionCompanyOnMovieListRelationFilterObjectSchema } from './ProductionCompanyOnMovieListRelationFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => ProductionCompanyWhereInputObjectSchema),
        z.lazy(() => ProductionCompanyWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => ProductionCompanyWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => ProductionCompanyWhereInputObjectSchema),
        z.lazy(() => ProductionCompanyWhereInputObjectSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => IntFilterObjectSchema), z.number()]).optional(),
    logo_path: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    name: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    origin_country: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    movies: z
      .lazy(() => ProductionCompanyOnMovieListRelationFilterObjectSchema)
      .optional(),
  })
  .strict();

export const ProductionCompanyWhereInputObjectSchema = Schema;
