import { z } from 'zod';
import { ProductionCompanyUpdateManyMutationInputObjectSchema } from './objects/ProductionCompanyUpdateManyMutationInput.schema';
import { ProductionCompanyWhereInputObjectSchema } from './objects/ProductionCompanyWhereInput.schema';

export const ProductionCompanyUpdateManySchema = z.object({
  data: ProductionCompanyUpdateManyMutationInputObjectSchema,
  where: ProductionCompanyWhereInputObjectSchema.optional(),
});
