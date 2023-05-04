import { z } from 'zod';
import { CrewUpdateInputObjectSchema } from './objects/CrewUpdateInput.schema';
import { CrewUncheckedUpdateInputObjectSchema } from './objects/CrewUncheckedUpdateInput.schema';
import { CrewWhereUniqueInputObjectSchema } from './objects/CrewWhereUniqueInput.schema';

export const CrewUpdateOneSchema = z.object({
  data: z.union([
    CrewUpdateInputObjectSchema,
    CrewUncheckedUpdateInputObjectSchema,
  ]),
  where: CrewWhereUniqueInputObjectSchema,
});
