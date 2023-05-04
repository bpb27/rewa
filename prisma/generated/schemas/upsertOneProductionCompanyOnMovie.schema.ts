import { z } from 'zod';
import { ProductionCompanyOnMovieWhereUniqueInputObjectSchema } from './objects/ProductionCompanyOnMovieWhereUniqueInput.schema';
import { ProductionCompanyOnMovieCreateInputObjectSchema } from './objects/ProductionCompanyOnMovieCreateInput.schema';
import { ProductionCompanyOnMovieUncheckedCreateInputObjectSchema } from './objects/ProductionCompanyOnMovieUncheckedCreateInput.schema';
import { ProductionCompanyOnMovieUpdateInputObjectSchema } from './objects/ProductionCompanyOnMovieUpdateInput.schema';
import { ProductionCompanyOnMovieUncheckedUpdateInputObjectSchema } from './objects/ProductionCompanyOnMovieUncheckedUpdateInput.schema';

export const ProductionCompanyOnMovieUpsertSchema = z.object({
  where: ProductionCompanyOnMovieWhereUniqueInputObjectSchema,
  create: z.union([
    ProductionCompanyOnMovieCreateInputObjectSchema,
    ProductionCompanyOnMovieUncheckedCreateInputObjectSchema,
  ]),
  update: z.union([
    ProductionCompanyOnMovieUpdateInputObjectSchema,
    ProductionCompanyOnMovieUncheckedUpdateInputObjectSchema,
  ]),
});
