import { z } from 'zod';
import { ProductionCompanyWhereInputObjectSchema } from './objects/ProductionCompanyWhereInput.schema';

export const ProductionCompanyDeleteManySchema = z.object({
  where: ProductionCompanyWhereInputObjectSchema.optional(),
});
