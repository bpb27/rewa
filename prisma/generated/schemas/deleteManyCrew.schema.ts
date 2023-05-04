import { z } from 'zod';
import { CrewWhereInputObjectSchema } from './objects/CrewWhereInput.schema';

export const CrewDeleteManySchema = z.object({
  where: CrewWhereInputObjectSchema.optional(),
});
