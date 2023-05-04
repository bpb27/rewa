import { z } from 'zod';
import { IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { GenresOnMovieUpdateManyWithoutGenreNestedInputObjectSchema } from './GenresOnMovieUpdateManyWithoutGenreNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenreUpdateInput> = z
  .object({
    id: z
      .union([
        z.number(),
        z.lazy(() => IntFieldUpdateOperationsInputObjectSchema),
      ])
      .optional(),
    name: z
      .union([
        z.string(),
        z.lazy(() => StringFieldUpdateOperationsInputObjectSchema),
      ])
      .optional(),
    movies: z
      .lazy(() => GenresOnMovieUpdateManyWithoutGenreNestedInputObjectSchema)
      .optional(),
  })
  .strict();

export const GenreUpdateInputObjectSchema = Schema;
