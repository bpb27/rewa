import { z } from 'zod';
import { CrewUpdateManyMutationInputObjectSchema } from './objects/CrewUpdateManyMutationInput.schema';
import { CrewWhereInputObjectSchema } from './objects/CrewWhereInput.schema';

export const CrewUpdateManySchema = z.object({
  data: CrewUpdateManyMutationInputObjectSchema,
  where: CrewWhereInputObjectSchema.optional(),
});
