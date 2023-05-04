import { z } from 'zod';
import { CrewWhereUniqueInputObjectSchema } from './objects/CrewWhereUniqueInput.schema';
import { CrewCreateInputObjectSchema } from './objects/CrewCreateInput.schema';
import { CrewUncheckedCreateInputObjectSchema } from './objects/CrewUncheckedCreateInput.schema';
import { CrewUpdateInputObjectSchema } from './objects/CrewUpdateInput.schema';
import { CrewUncheckedUpdateInputObjectSchema } from './objects/CrewUncheckedUpdateInput.schema';

export const CrewUpsertSchema = z.object({
  where: CrewWhereUniqueInputObjectSchema,
  create: z.union([
    CrewCreateInputObjectSchema,
    CrewUncheckedCreateInputObjectSchema,
  ]),
  update: z.union([
    CrewUpdateInputObjectSchema,
    CrewUncheckedUpdateInputObjectSchema,
  ]),
});
