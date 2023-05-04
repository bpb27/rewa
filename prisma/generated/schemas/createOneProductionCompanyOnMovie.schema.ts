import { z } from 'zod';
import { ProductionCompanyOnMovieCreateInputObjectSchema } from './objects/ProductionCompanyOnMovieCreateInput.schema';
import { ProductionCompanyOnMovieUncheckedCreateInputObjectSchema } from './objects/ProductionCompanyOnMovieUncheckedCreateInput.schema';

export const ProductionCompanyOnMovieCreateOneSchema = z.object({
  data: z.union([
    ProductionCompanyOnMovieCreateInputObjectSchema,
    ProductionCompanyOnMovieUncheckedCreateInputObjectSchema,
  ]),
});
