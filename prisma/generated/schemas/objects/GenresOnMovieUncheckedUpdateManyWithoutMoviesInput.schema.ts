import { z } from 'zod';
import { IntFieldUpdateOperationsInputObjectSchema } from './IntFieldUpdateOperationsInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieUncheckedUpdateManyWithoutMoviesInput> =
  z
    .object({
      movieId: z
        .union([
          z.number(),
          z.lazy(() => IntFieldUpdateOperationsInputObjectSchema),
        ])
        .optional(),
    })
    .strict();

export const GenresOnMovieUncheckedUpdateManyWithoutMoviesInputObjectSchema =
  Schema;
