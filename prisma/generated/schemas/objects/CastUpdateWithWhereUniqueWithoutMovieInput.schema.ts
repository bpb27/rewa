import { z } from 'zod';
import { CastWhereUniqueInputObjectSchema } from './CastWhereUniqueInput.schema';
import { CastUpdateWithoutMovieInputObjectSchema } from './CastUpdateWithoutMovieInput.schema';
import { CastUncheckedUpdateWithoutMovieInputObjectSchema } from './CastUncheckedUpdateWithoutMovieInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CastUpdateWithWhereUniqueWithoutMovieInput> = z
  .object({
    where: z.lazy(() => CastWhereUniqueInputObjectSchema),
    data: z.union([
      z.lazy(() => CastUpdateWithoutMovieInputObjectSchema),
      z.lazy(() => CastUncheckedUpdateWithoutMovieInputObjectSchema),
    ]),
  })
  .strict();

export const CastUpdateWithWhereUniqueWithoutMovieInputObjectSchema = Schema;
