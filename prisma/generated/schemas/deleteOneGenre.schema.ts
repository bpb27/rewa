import { z } from 'zod';
import { GenreWhereUniqueInputObjectSchema } from './objects/GenreWhereUniqueInput.schema';

export const GenreDeleteOneSchema = z.object({
  where: GenreWhereUniqueInputObjectSchema,
});
