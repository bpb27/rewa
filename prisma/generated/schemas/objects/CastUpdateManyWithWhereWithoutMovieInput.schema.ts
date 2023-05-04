import { z } from 'zod';
import { CastScalarWhereInputObjectSchema } from './CastScalarWhereInput.schema';
import { CastUpdateManyMutationInputObjectSchema } from './CastUpdateManyMutationInput.schema';
import { CastUncheckedUpdateManyWithoutCastInputObjectSchema } from './CastUncheckedUpdateManyWithoutCastInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CastUpdateManyWithWhereWithoutMovieInput> = z
  .object({
    where: z.lazy(() => CastScalarWhereInputObjectSchema),
    data: z.union([
      z.lazy(() => CastUpdateManyMutationInputObjectSchema),
      z.lazy(() => CastUncheckedUpdateManyWithoutCastInputObjectSchema),
    ]),
  })
  .strict();

export const CastUpdateManyWithWhereWithoutMovieInputObjectSchema = Schema;
