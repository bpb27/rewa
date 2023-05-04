import { z } from 'zod';
import { ProductionCompanyOnMovieWhereUniqueInputObjectSchema } from './objects/ProductionCompanyOnMovieWhereUniqueInput.schema';

export const ProductionCompanyOnMovieDeleteOneSchema = z.object({
  where: ProductionCompanyOnMovieWhereUniqueInputObjectSchema,
});
