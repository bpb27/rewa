import { z } from 'zod';
import { GenreUpdateManyMutationInputObjectSchema } from './objects/GenreUpdateManyMutationInput.schema';
import { GenreWhereInputObjectSchema } from './objects/GenreWhereInput.schema';

export const GenreUpdateManySchema = z.object({
  data: GenreUpdateManyMutationInputObjectSchema,
  where: GenreWhereInputObjectSchema.optional(),
});
