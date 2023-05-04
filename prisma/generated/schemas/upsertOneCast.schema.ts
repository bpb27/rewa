import { z } from 'zod';
import { CastWhereUniqueInputObjectSchema } from './objects/CastWhereUniqueInput.schema';
import { CastCreateInputObjectSchema } from './objects/CastCreateInput.schema';
import { CastUncheckedCreateInputObjectSchema } from './objects/CastUncheckedCreateInput.schema';
import { CastUpdateInputObjectSchema } from './objects/CastUpdateInput.schema';
import { CastUncheckedUpdateInputObjectSchema } from './objects/CastUncheckedUpdateInput.schema';

export const CastUpsertSchema = z.object({
  where: CastWhereUniqueInputObjectSchema,
  create: z.union([
    CastCreateInputObjectSchema,
    CastUncheckedCreateInputObjectSchema,
  ]),
  update: z.union([
    CastUpdateInputObjectSchema,
    CastUncheckedUpdateInputObjectSchema,
  ]),
});
