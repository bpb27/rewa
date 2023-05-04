import { z } from 'zod';
import { ProductionCompanyWhereUniqueInputObjectSchema } from './objects/ProductionCompanyWhereUniqueInput.schema';

export const ProductionCompanyDeleteOneSchema = z.object({
  where: ProductionCompanyWhereUniqueInputObjectSchema,
});
