import { z } from 'zod';
import { ProductionCompanyWhereInputObjectSchema } from './objects/ProductionCompanyWhereInput.schema';
import { ProductionCompanyOrderByWithAggregationInputObjectSchema } from './objects/ProductionCompanyOrderByWithAggregationInput.schema';
import { ProductionCompanyScalarWhereWithAggregatesInputObjectSchema } from './objects/ProductionCompanyScalarWhereWithAggregatesInput.schema';
import { ProductionCompanyScalarFieldEnumSchema } from './enums/ProductionCompanyScalarFieldEnum.schema';

export const ProductionCompanyGroupBySchema = z.object({
  where: ProductionCompanyWhereInputObjectSchema.optional(),
  orderBy: z
    .union([
      ProductionCompanyOrderByWithAggregationInputObjectSchema,
      ProductionCompanyOrderByWithAggregationInputObjectSchema.array(),
    ])
    .optional(),
  having:
    ProductionCompanyScalarWhereWithAggregatesInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  by: z.array(ProductionCompanyScalarFieldEnumSchema),
});
