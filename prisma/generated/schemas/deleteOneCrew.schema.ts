import { z } from 'zod';
import { CrewWhereUniqueInputObjectSchema } from './objects/CrewWhereUniqueInput.schema';

export const CrewDeleteOneSchema = z.object({
  where: CrewWhereUniqueInputObjectSchema,
});
