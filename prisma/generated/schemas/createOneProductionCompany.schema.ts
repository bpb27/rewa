import { z } from 'zod';
import { ProductionCompanyCreateInputObjectSchema } from './objects/ProductionCompanyCreateInput.schema';
import { ProductionCompanyUncheckedCreateInputObjectSchema } from './objects/ProductionCompanyUncheckedCreateInput.schema';

export const ProductionCompanyCreateOneSchema = z.object({
  data: z.union([
    ProductionCompanyCreateInputObjectSchema,
    ProductionCompanyUncheckedCreateInputObjectSchema,
  ]),
});
