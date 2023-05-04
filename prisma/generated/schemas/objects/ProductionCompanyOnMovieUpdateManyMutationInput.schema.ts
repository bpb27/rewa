import { z } from 'zod';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.ProductionCompanyOnMovieUpdateManyMutationInput> =
  z.object({}).strict();

export const ProductionCompanyOnMovieUpdateManyMutationInputObjectSchema =
  Schema;
