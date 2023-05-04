import { z } from 'zod';
import { GenreOrderByWithRelationInputObjectSchema } from './objects/GenreOrderByWithRelationInput.schema';
import { GenreWhereInputObjectSchema } from './objects/GenreWhereInput.schema';
import { GenreWhereUniqueInputObjectSchema } from './objects/GenreWhereUniqueInput.schema';
import { GenreScalarFieldEnumSchema } from './enums/GenreScalarFieldEnum.schema';

export const GenreFindManySchema = z.object({
  orderBy: z
    .union([
      GenreOrderByWithRelationInputObjectSchema,
      GenreOrderByWithRelationInputObjectSchema.array(),
    ])
    .optional(),
  where: GenreWhereInputObjectSchema.optional(),
  cursor: GenreWhereUniqueInputObjectSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.array(GenreScalarFieldEnumSchema).optional(),
});
