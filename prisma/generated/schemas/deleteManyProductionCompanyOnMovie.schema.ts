import { z } from 'zod';
import { ProductionCompanyOnMovieWhereInputObjectSchema } from './objects/ProductionCompanyOnMovieWhereInput.schema';

export const ProductionCompanyOnMovieDeleteManySchema = z.object({
  where: ProductionCompanyOnMovieWhereInputObjectSchema.optional(),
});
