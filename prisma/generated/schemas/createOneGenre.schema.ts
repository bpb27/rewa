import { z } from 'zod';
import { GenreCreateInputObjectSchema } from './objects/GenreCreateInput.schema';
import { GenreUncheckedCreateInputObjectSchema } from './objects/GenreUncheckedCreateInput.schema';

export const GenreCreateOneSchema = z.object({
  data: z.union([
    GenreCreateInputObjectSchema,
    GenreUncheckedCreateInputObjectSchema,
  ]),
});
