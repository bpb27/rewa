import { z } from 'zod';
import { CrewWhereInputObjectSchema } from './objects/CrewWhereInput.schema';
import { CrewOrderByWithAggregationInputObjectSchema } from './objects/CrewOrderByWithAggregationInput.schema';
import { CrewScalarWhereWithAggregatesInputObjectSchema } from './objects/CrewScalarWhereWithAggregatesInput.schema';
import { CrewScalarFieldEnumSchema } from './enums/CrewScalarFieldEnum.schema';

export const CrewGroupBySchema = z.object({
  where: CrewWhereInputObjectSchema.optional(),
  orderBy: z
    .union([
      CrewOrderByWithAggregationInputObjectSchema,
      CrewOrderByWithAggregationInputObjectSchema.array(),
    ])
    .optional(),
  having: CrewScalarWhereWithAggregatesInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  by: z.array(CrewScalarFieldEnumSchema),
});
