import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieUpdateManyMutationInput> = z
  .object({})
  .strict();

export const GenresOnMovieUpdateManyMutationInputObjectSchema = Schema;
