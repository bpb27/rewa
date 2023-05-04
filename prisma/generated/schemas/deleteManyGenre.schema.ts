import { z } from 'zod';
import { GenreWhereInputObjectSchema } from './objects/GenreWhereInput.schema';

export const GenreDeleteManySchema = z.object({
  where: GenreWhereInputObjectSchema.optional(),
});
