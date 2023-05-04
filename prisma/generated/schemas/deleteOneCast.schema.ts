import { z } from 'zod';
import { CastWhereUniqueInputObjectSchema } from './objects/CastWhereUniqueInput.schema';

export const CastDeleteOneSchema = z.object({
  where: CastWhereUniqueInputObjectSchema,
});
