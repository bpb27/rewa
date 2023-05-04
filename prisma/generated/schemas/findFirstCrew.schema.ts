import { z } from 'zod';
import { CrewOrderByWithRelationInputObjectSchema } from './objects/CrewOrderByWithRelationInput.schema';
import { CrewWhereInputObjectSchema } from './objects/CrewWhereInput.schema';
import { CrewWhereUniqueInputObjectSchema } from './objects/CrewWhereUniqueInput.schema';
import { CrewScalarFieldEnumSchema } from './enums/CrewScalarFieldEnum.schema';

export const CrewFindFirstSchema = z.object({
  orderBy: z
    .union([
      CrewOrderByWithRelationInputObjectSchema,
      CrewOrderByWithRelationInputObjectSchema.array(),
    ])
    .optional(),
  where: CrewWhereInputObjectSchema.optional(),
  cursor: CrewWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.array(CrewScalarFieldEnumSchema).optional(),
});
