import { z } from 'zod';
import { ProductionCompanyOnMovieUpdateManyMutationInputObjectSchema } from './objects/ProductionCompanyOnMovieUpdateManyMutationInput.schema';
import { ProductionCompanyOnMovieWhereInputObjectSchema } from './objects/ProductionCompanyOnMovieWhereInput.schema';

export const ProductionCompanyOnMovieUpdateManySchema = z.object({
  data: ProductionCompanyOnMovieUpdateManyMutationInputObjectSchema,
  where: ProductionCompanyOnMovieWhereInputObjectSchema.optional(),
});
