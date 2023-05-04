import { z } from 'zod';
import { CastWhereUniqueInputObjectSchema } from './CastWhereUniqueInput.schema';
import { CastCreateWithoutMovieInputObjectSchema } from './CastCreateWithoutMovieInput.schema';
import { CastUncheckedCreateWithoutMovieInputObjectSchema } from './CastUncheckedCreateWithoutMovieInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CastCreateOrConnectWithoutMovieInput> = z
  .object({
    where: z.lazy(() => CastWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => CastCreateWithoutMovieInputObjectSchema),
      z.lazy(() => CastUncheckedCreateWithoutMovieInputObjectSchema),
    ]),
  })
  .strict();

export const CastCreateOrConnectWithoutMovieInputObjectSchema = Schema;
