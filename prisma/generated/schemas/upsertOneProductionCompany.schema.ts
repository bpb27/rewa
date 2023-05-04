import { z } from 'zod';
import { ProductionCompanyWhereUniqueInputObjectSchema } from './objects/ProductionCompanyWhereUniqueInput.schema';
import { ProductionCompanyCreateInputObjectSchema } from './objects/ProductionCompanyCreateInput.schema';
import { ProductionCompanyUncheckedCreateInputObjectSchema } from './objects/ProductionCompanyUncheckedCreateInput.schema';
import { ProductionCompanyUpdateInputObjectSchema } from './objects/ProductionCompanyUpdateInput.schema';
import { ProductionCompanyUncheckedUpdateInputObjectSchema } from './objects/ProductionCompanyUncheckedUpdateInput.schema';

export const ProductionCompanyUpsertSchema = z.object({
  where: ProductionCompanyWhereUniqueInputObjectSchema,
  create: z.union([
    ProductionCompanyCreateInputObjectSchema,
    ProductionCompanyUncheckedCreateInputObjectSchema,
  ]),
  update: z.union([
    ProductionCompanyUpdateInputObjectSchema,
    ProductionCompanyUncheckedUpdateInputObjectSchema,
  ]),
});
