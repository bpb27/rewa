import { z } from 'zod';
import { ProductionCompanyOrderByWithRelationInputObjectSchema } from './objects/ProductionCompanyOrderByWithRelationInput.schema';
import { ProductionCompanyWhereInputObjectSchema } from './objects/ProductionCompanyWhereInput.schema';
import { ProductionCompanyWhereUniqueInputObjectSchema } from './objects/ProductionCompanyWhereUniqueInput.schema';
import { ProductionCompanyCountAggregateInputObjectSchema } from './objects/ProductionCompanyCountAggregateInput.schema';
import { ProductionCompanyMinAggregateInputObjectSchema } from './objects/ProductionCompanyMinAggregateInput.schema';
import { ProductionCompanyMaxAggregateInputObjectSchema } from './objects/ProductionCompanyMaxAggregateInput.schema';
import { ProductionCompanyAvgAggregateInputObjectSchema } from './objects/ProductionCompanyAvgAggregateInput.schema';
import { ProductionCompanySumAggregateInputObjectSchema } from './objects/ProductionCompanySumAggregateInput.schema';

export const ProductionCompanyAggregateSchema = z.object({
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
  _count: z
    .union([z.literal(true), ProductionCompanyCountAggregateInputObjectSchema])
    .optional(),
  _min: ProductionCompanyMinAggregateInputObjectSchema.optional(),
  _max: ProductionCompanyMaxAggregateInputObjectSchema.optional(),
  _avg: ProductionCompanyAvgAggregateInputObjectSchema.optional(),
  _sum: ProductionCompanySumAggregateInputObjectSchema.optional(),
});
