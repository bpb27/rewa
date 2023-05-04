import { z } from 'zod';
import { CastWhereInputObjectSchema } from './objects/CastWhereInput.schema';
import { CastOrderByWithAggregationInputObjectSchema } from './objects/CastOrderByWithAggregationInput.schema';
import { CastScalarWhereWithAggregatesInputObjectSchema } from './objects/CastScalarWhereWithAggregatesInput.schema';
import { CastScalarFieldEnumSchema } from './enums/CastScalarFieldEnum.schema';

export const CastGroupBySchema = z.object({
  where: CastWhereInputObjectSchema.optional(),
  orderBy: z
    .union([
      CastOrderByWithAggregationInputObjectSchema,
      CastOrderByWithAggregationInputObjectSchema.array(),
    ])
    .optional(),
  having: CastScalarWhereWithAggregatesInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  by: z.array(CastScalarFieldEnumSchema),
});
