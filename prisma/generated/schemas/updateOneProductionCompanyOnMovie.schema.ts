import { z } from 'zod';
import { ProductionCompanyOnMovieUpdateInputObjectSchema } from './objects/ProductionCompanyOnMovieUpdateInput.schema';
import { ProductionCompanyOnMovieUncheckedUpdateInputObjectSchema } from './objects/ProductionCompanyOnMovieUncheckedUpdateInput.schema';
import { ProductionCompanyOnMovieWhereUniqueInputObjectSchema } from './objects/ProductionCompanyOnMovieWhereUniqueInput.schema';

export const ProductionCompanyOnMovieUpdateOneSchema = z.object({
  data: z.union([
    ProductionCompanyOnMovieUpdateInputObjectSchema,
    ProductionCompanyOnMovieUncheckedUpdateInputObjectSchema,
  ]),
  where: ProductionCompanyOnMovieWhereUniqueInputObjectSchema,
});
