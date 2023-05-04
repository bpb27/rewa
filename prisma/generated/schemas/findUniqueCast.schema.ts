import { z } from 'zod';
import { CastWhereUniqueInputObjectSchema } from './objects/CastWhereUniqueInput.schema';

export const CastFindUniqueSchema = z.object({
  where: CastWhereUniqueInputObjectSchema,
});
