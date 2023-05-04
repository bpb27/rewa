import { z } from 'zod';
import { ProductionCompanyOnMovieOrderByWithRelationInputObjectSchema } from './objects/ProductionCompanyOnMovieOrderByWithRelationInput.schema';
import { ProductionCompanyOnMovieWhereInputObjectSchema } from './objects/ProductionCompanyOnMovieWhereInput.schema';
import { ProductionCompanyOnMovieWhereUniqueInputObjectSchema } from './objects/ProductionCompanyOnMovieWhereUniqueInput.schema';
import { ProductionCompanyOnMovieScalarFieldEnumSchema } from './enums/ProductionCompanyOnMovieScalarFieldEnum.schema';

export const ProductionCompanyOnMovieFindManySchema = z.object({
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
  distinct: z.array(ProductionCompanyOnMovieScalarFieldEnumSchema).optional(),
});
