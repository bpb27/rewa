import { z } from 'zod';
import { ProductionCompanyWhereUniqueInputObjectSchema } from './objects/ProductionCompanyWhereUniqueInput.schema';

export const ProductionCompanyFindUniqueSchema = z.object({
  where: ProductionCompanyWhereUniqueInputObjectSchema,
});
