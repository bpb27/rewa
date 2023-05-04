import { z } from 'zod';
import { CastOrderByWithRelationInputObjectSchema } from './objects/CastOrderByWithRelationInput.schema';
import { CastWhereInputObjectSchema } from './objects/CastWhereInput.schema';
import { CastWhereUniqueInputObjectSchema } from './objects/CastWhereUniqueInput.schema';
import { CastScalarFieldEnumSchema } from './enums/CastScalarFieldEnum.schema';

export const CastFindManySchema = z.object({
  orderBy: z
    .union([
      CastOrderByWithRelationInputObjectSchema,
      CastOrderByWithRelationInputObjectSchema.array(),
    ])
    .optional(),
  where: CastWhereInputObjectSchema.optional(),
  cursor: CastWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.array(CastScalarFieldEnumSchema).optional(),
});
