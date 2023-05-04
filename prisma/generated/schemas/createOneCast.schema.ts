import { z } from 'zod';
import { CastCreateInputObjectSchema } from './objects/CastCreateInput.schema';
import { CastUncheckedCreateInputObjectSchema } from './objects/CastUncheckedCreateInput.schema';

export const CastCreateOneSchema = z.object({
  data: z.union([
    CastCreateInputObjectSchema,
    CastUncheckedCreateInputObjectSchema,
  ]),
});
