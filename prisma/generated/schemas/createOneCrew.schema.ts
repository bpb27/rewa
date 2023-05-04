import { z } from 'zod';
import { CrewCreateInputObjectSchema } from './objects/CrewCreateInput.schema';
import { CrewUncheckedCreateInputObjectSchema } from './objects/CrewUncheckedCreateInput.schema';

export const CrewCreateOneSchema = z.object({
  data: z.union([
    CrewCreateInputObjectSchema,
    CrewUncheckedCreateInputObjectSchema,
  ]),
});
