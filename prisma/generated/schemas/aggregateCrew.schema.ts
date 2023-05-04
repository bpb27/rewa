import { z } from 'zod';
import { CrewOrderByWithRelationInputObjectSchema } from './objects/CrewOrderByWithRelationInput.schema';
import { CrewWhereInputObjectSchema } from './objects/CrewWhereInput.schema';
import { CrewWhereUniqueInputObjectSchema } from './objects/CrewWhereUniqueInput.schema';
import { CrewCountAggregateInputObjectSchema } from './objects/CrewCountAggregateInput.schema';
import { CrewMinAggregateInputObjectSchema } from './objects/CrewMinAggregateInput.schema';
import { CrewMaxAggregateInputObjectSchema } from './objects/CrewMaxAggregateInput.schema';
import { CrewAvgAggregateInputObjectSchema } from './objects/CrewAvgAggregateInput.schema';
import { CrewSumAggregateInputObjectSchema } from './objects/CrewSumAggregateInput.schema';

export const CrewAggregateSchema = z.object({
  orderBy: z
    .union([
      CrewOrderByWithRelationInputObjectSchema,
      CrewOrderByWithRelationInputObjectSchema.array(),
    ])
    .optional(),
  where: CrewWhereInputObjectSchema.optional(),
  cursor: CrewWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  _count: z
    .union([z.literal(true), CrewCountAggregateInputObjectSchema])
    .optional(),
  _min: CrewMinAggregateInputObjectSchema.optional(),
  _max: CrewMaxAggregateInputObjectSchema.optional(),
  _avg: CrewAvgAggregateInputObjectSchema.optional(),
  _sum: CrewSumAggregateInputObjectSchema.optional(),
});
