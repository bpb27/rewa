import { z } from 'zod';
import { CastUpdateInputObjectSchema } from './objects/CastUpdateInput.schema';
import { CastUncheckedUpdateInputObjectSchema } from './objects/CastUncheckedUpdateInput.schema';
import { CastWhereUniqueInputObjectSchema } from './objects/CastWhereUniqueInput.schema';

export const CastUpdateOneSchema = z.object({
  data: z.union([
    CastUpdateInputObjectSchema,
    CastUncheckedUpdateInputObjectSchema,
  ]),
  where: CastWhereUniqueInputObjectSchema,
});
