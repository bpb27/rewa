import { z } from 'zod';
import { CastWhereUniqueInputObjectSchema } from './CastWhereUniqueInput.schema';
import { CastUpdateWithoutMovieInputObjectSchema } from './CastUpdateWithoutMovieInput.schema';
import { CastUncheckedUpdateWithoutMovieInputObjectSchema } from './CastUncheckedUpdateWithoutMovieInput.schema';
import { CastCreateWithoutMovieInputObjectSchema } from './CastCreateWithoutMovieInput.schema';
import { CastUncheckedCreateWithoutMovieInputObjectSchema } from './CastUncheckedCreateWithoutMovieInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CastUpsertWithWhereUniqueWithoutMovieInput> = z
  .object({
    where: z.lazy(() => CastWhereUniqueInputObjectSchema),
    update: z.union([
      z.lazy(() => CastUpdateWithoutMovieInputObjectSchema),
      z.lazy(() => CastUncheckedUpdateWithoutMovieInputObjectSchema),
    ]),
    create: z.union([
      z.lazy(() => CastCreateWithoutMovieInputObjectSchema),
      z.lazy(() => CastUncheckedCreateWithoutMovieInputObjectSchema),
    ]),
  })
  .strict();

export const CastUpsertWithWhereUniqueWithoutMovieInputObjectSchema = Schema;
