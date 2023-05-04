import { z } from 'zod';
import { ProductionCompanyUpdateInputObjectSchema } from './objects/ProductionCompanyUpdateInput.schema';
import { ProductionCompanyUncheckedUpdateInputObjectSchema } from './objects/ProductionCompanyUncheckedUpdateInput.schema';
import { ProductionCompanyWhereUniqueInputObjectSchema } from './objects/ProductionCompanyWhereUniqueInput.schema';

export const ProductionCompanyUpdateOneSchema = z.object({
  data: z.union([
    ProductionCompanyUpdateInputObjectSchema,
    ProductionCompanyUncheckedUpdateInputObjectSchema,
  ]),
  where: ProductionCompanyWhereUniqueInputObjectSchema,
});
