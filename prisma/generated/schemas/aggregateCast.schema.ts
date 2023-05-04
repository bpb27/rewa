import { z } from 'zod';
import { CastOrderByWithRelationInputObjectSchema } from './objects/CastOrderByWithRelationInput.schema';
import { CastWhereInputObjectSchema } from './objects/CastWhereInput.schema';
import { CastWhereUniqueInputObjectSchema } from './objects/CastWhereUniqueInput.schema';
import { CastCountAggregateInputObjectSchema } from './objects/CastCountAggregateInput.schema';
import { CastMinAggregateInputObjectSchema } from './objects/CastMinAggregateInput.schema';
import { CastMaxAggregateInputObjectSchema } from './objects/CastMaxAggregateInput.schema';
import { CastAvgAggregateInputObjectSchema } from './objects/CastAvgAggregateInput.schema';
import { CastSumAggregateInputObjectSchema } from './objects/CastSumAggregateInput.schema';

export const CastAggregateSchema = z.object({
  orderBy: z
    .union([
      CastOrderByWithRelationInputObjectSchema,
      CastOrderByWithRelationInputObjectSchema.array(),
    ])
    .optional(),
  where: CastWhereInputObjectSchema.optional(),
  cursor: CastWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  _count: z
    .union([z.literal(true), CastCountAggregateInputObjectSchema])
    .optional(),
  _min: CastMinAggregateInputObjectSchema.optional(),
  _max: CastMaxAggregateInputObjectSchema.optional(),
  _avg: CastAvgAggregateInputObjectSchema.optional(),
  _sum: CastSumAggregateInputObjectSchema.optional(),
});
