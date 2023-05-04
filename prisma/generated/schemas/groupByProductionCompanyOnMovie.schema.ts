import { z } from 'zod';
import { ProductionCompanyOnMovieWhereInputObjectSchema } from './objects/ProductionCompanyOnMovieWhereInput.schema';
import { ProductionCompanyOnMovieOrderByWithAggregationInputObjectSchema } from './objects/ProductionCompanyOnMovieOrderByWithAggregationInput.schema';
import { ProductionCompanyOnMovieScalarWhereWithAggregatesInputObjectSchema } from './objects/ProductionCompanyOnMovieScalarWhereWithAggregatesInput.schema';
import { ProductionCompanyOnMovieScalarFieldEnumSchema } from './enums/ProductionCompanyOnMovieScalarFieldEnum.schema';

export const ProductionCompanyOnMovieGroupBySchema = z.object({
  where: ProductionCompanyOnMovieWhereInputObjectSchema.optional(),
  orderBy: z
    .union([
      ProductionCompanyOnMovieOrderByWithAggregationInputObjectSchema,
      ProductionCompanyOnMovieOrderByWithAggregationInputObjectSchema.array(),
    ])
    .optional(),
  having:
    ProductionCompanyOnMovieScalarWhereWithAggregatesInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  by: z.array(ProductionCompanyOnMovieScalarFieldEnumSchema),
});
