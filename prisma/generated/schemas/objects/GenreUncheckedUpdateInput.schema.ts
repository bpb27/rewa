import { z } from 'zod';
import { IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { GenresOnMovieUncheckedUpdateManyWithoutGenreNestedInputObjectSchema } from './GenresOnMovieUncheckedUpdateManyWithoutGenreNestedInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenreUncheckedUpdateInput> = z
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
      .lazy(
        () =>
          GenresOnMovieUncheckedUpdateManyWithoutGenreNestedInputObjectSchema,
      )
      .optional(),
  })
  .strict();

export const GenreUncheckedUpdateInputObjectSchema = Schema;
