import { z } from 'zod';
import { CastUpdateManyMutationInputObjectSchema } from './objects/CastUpdateManyMutationInput.schema';
import { CastWhereInputObjectSchema } from './objects/CastWhereInput.schema';

export const CastUpdateManySchema = z.object({
  data: CastUpdateManyMutationInputObjectSchema,
  where: CastWhereInputObjectSchema.optional(),
});
