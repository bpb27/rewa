import { z } from 'zod';
import { GenreWhereInputObjectSchema } from './objects/GenreWhereInput.schema';
import { GenreOrderByWithAggregationInputObjectSchema } from './objects/GenreOrderByWithAggregationInput.schema';
import { GenreScalarWhereWithAggregatesInputObjectSchema } from './objects/GenreScalarWhereWithAggregatesInput.schema';
import { GenreScalarFieldEnumSchema } from './enums/GenreScalarFieldEnum.schema';

export const GenreGroupBySchema = z.object({
  where: GenreWhereInputObjectSchema.optional(),
  orderBy: z
    .union([
      GenreOrderByWithAggregationInputObjectSchema,
      GenreOrderByWithAggregationInputObjectSchema.array(),
    ])
    .optional(),
  having: GenreScalarWhereWithAggregatesInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  by: z.array(GenreScalarFieldEnumSchema),
});
