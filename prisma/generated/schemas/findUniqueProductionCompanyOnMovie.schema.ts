import { z } from 'zod';
import { ProductionCompanyOnMovieWhereUniqueInputObjectSchema } from './objects/ProductionCompanyOnMovieWhereUniqueInput.schema';

export const ProductionCompanyOnMovieFindUniqueSchema = z.object({
  where: ProductionCompanyOnMovieWhereUniqueInputObjectSchema,
});
