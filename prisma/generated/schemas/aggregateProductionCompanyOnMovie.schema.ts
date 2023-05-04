import { z } from 'zod';
import { ProductionCompanyOnMovieOrderByWithRelationInputObjectSchema } from './objects/ProductionCompanyOnMovieOrderByWithRelationInput.schema';
import { ProductionCompanyOnMovieWhereInputObjectSchema } from './objects/ProductionCompanyOnMovieWhereInput.schema';
import { ProductionCompanyOnMovieWhereUniqueInputObjectSchema } from './objects/ProductionCompanyOnMovieWhereUniqueInput.schema';
import { ProductionCompanyOnMovieCountAggregateInputObjectSchema } from './objects/ProductionCompanyOnMovieCountAggregateInput.schema';
import { ProductionCompanyOnMovieMinAggregateInputObjectSchema } from './objects/ProductionCompanyOnMovieMinAggregateInput.schema';
import { ProductionCompanyOnMovieMaxAggregateInputObjectSchema } from './objects/ProductionCompanyOnMovieMaxAggregateInput.schema';
import { ProductionCompanyOnMovieAvgAggregateInputObjectSchema } from './objects/ProductionCompanyOnMovieAvgAggregateInput.schema';
import { ProductionCompanyOnMovieSumAggregateInputObjectSchema } from './objects/ProductionCompanyOnMovieSumAggregateInput.schema';

export const ProductionCompanyOnMovieAggregateSchema = z.object({
  orderBy: z
    .union([
      ProductionCompanyOnMovieOrderByWithRelationInputObjectSchema,
      ProductionCompanyOnMovieOrderByWithRelationInputObjectSchema.array(),
    ])
    .optional(),
  where: ProductionCompanyOnMovieWhereInputObjectSchema.optional(),
  cursor: ProductionCompanyOnMovieWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  _count: z
    .union([
      z.literal(true),
      ProductionCompanyOnMovieCountAggregateInputObjectSchema,
    ])
    .optional(),
  _min: ProductionCompanyOnMovieMinAggregateInputObjectSchema.optional(),
  _max: ProductionCompanyOnMovieMaxAggregateInputObjectSchema.optional(),
  _avg: ProductionCompanyOnMovieAvgAggregateInputObjectSchema.optional(),
  _sum: ProductionCompanyOnMovieSumAggregateInputObjectSchema.optional(),
});
