import { z } from 'zod';
import { CastWhereInputObjectSchema } from './objects/CastWhereInput.schema';

export const CastDeleteManySchema = z.object({
  where: CastWhereInputObjectSchema.optional(),
});
