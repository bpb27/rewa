import { z } from 'zod';
import { ProductionCompanyOrderByWithRelationInputObjectSchema } from './objects/ProductionCompanyOrderByWithRelationInput.schema';
import { ProductionCompanyWhereInputObjectSchema } from './objects/ProductionCompanyWhereInput.schema';
import { ProductionCompanyWhereUniqueInputObjectSchema } from './objects/ProductionCompanyWhereUniqueInput.schema';
import { ProductionCompanyScalarFieldEnumSchema } from './enums/ProductionCompanyScalarFieldEnum.schema';

export const ProductionCompanyFindFirstSchema = z.object({
  orderBy: z
    .union([
      ProductionCompanyOrderByWithRelationInputObjectSchema,
      ProductionCompanyOrderByWithRelationInputObjectSchema.array(),
    ])
    .optional(),
  where: ProductionCompanyWhereInputObjectSchema.optional(),
  cursor: ProductionCompanyWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.array(ProductionCompanyScalarFieldEnumSchema).optional(),
});
