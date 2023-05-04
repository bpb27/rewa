import { z } from 'zod';
import { CrewWhereUniqueInputObjectSchema } from './CrewWhereUniqueInput.schema';
import { CrewCreateWithoutMovieInputObjectSchema } from './CrewCreateWithoutMovieInput.schema';
import { CrewUncheckedCreateWithoutMovieInputObjectSchema } from './CrewUncheckedCreateWithoutMovieInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CrewCreateOrConnectWithoutMovieInput> = z
  .object({
    where: z.lazy(() => CrewWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => CrewCreateWithoutMovieInputObjectSchema),
      z.lazy(() => CrewUncheckedCreateWithoutMovieInputObjectSchema),
    ]),
  })
  .strict();

export const CrewCreateOrConnectWithoutMovieInputObjectSchema = Schema;
