import { z } from 'zod';
import { GenreWhereUniqueInputObjectSchema } from './objects/GenreWhereUniqueInput.schema';

export const GenreFindUniqueSchema = z.object({
  where: GenreWhereUniqueInputObjectSchema,
});
