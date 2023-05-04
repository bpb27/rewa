import { z } from 'zod';
import { GenreOrderByWithRelationInputObjectSchema } from './objects/GenreOrderByWithRelationInput.schema';
import { GenreWhereInputObjectSchema } from './objects/GenreWhereInput.schema';
import { GenreWhereUniqueInputObjectSchema } from './objects/GenreWhereUniqueInput.schema';
import { GenreCountAggregateInputObjectSchema } from './objects/GenreCountAggregateInput.schema';
import { GenreMinAggregateInputObjectSchema } from './objects/GenreMinAggregateInput.schema';
import { GenreMaxAggregateInputObjectSchema } from './objects/GenreMaxAggregateInput.schema';
import { GenreAvgAggregateInputObjectSchema } from './objects/GenreAvgAggregateInput.schema';
import { GenreSumAggregateInputObjectSchema } from './objects/GenreSumAggregateInput.schema';

export const GenreAggregateSchema = z.object({
  orderBy: z
    .union([
      GenreOrderByWithRelationInputObjectSchema,
      GenreOrderByWithRelationInputObjectSchema.array(),
    ])
    .optional(),
  where: GenreWhereInputObjectSchema.optional(),
  cursor: GenreWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  _count: z
    .union([z.literal(true), GenreCountAggregateInputObjectSchema])
    .optional(),
  _min: GenreMinAggregateInputObjectSchema.optional(),
  _max: GenreMaxAggregateInputObjectSchema.optional(),
  _avg: GenreAvgAggregateInputObjectSchema.optional(),
  _sum: GenreSumAggregateInputObjectSchema.optional(),
});
