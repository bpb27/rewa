import { z } from 'zod';
import { CrewWhereUniqueInputObjectSchema } from './objects/CrewWhereUniqueInput.schema';

export const CrewFindUniqueSchema = z.object({
  where: CrewWhereUniqueInputObjectSchema,
});
