import { z } from 'zod';
import { GenreUpdateInputObjectSchema } from './objects/GenreUpdateInput.schema';
import { GenreUncheckedUpdateInputObjectSchema } from './objects/GenreUncheckedUpdateInput.schema';
import { GenreWhereUniqueInputObjectSchema } from './objects/GenreWhereUniqueInput.schema';

export const GenreUpdateOneSchema = z.object({
  data: z.union([
    GenreUpdateInputObjectSchema,
    GenreUncheckedUpdateInputObjectSchema,
  ]),
  where: GenreWhereUniqueInputObjectSchema,
});
