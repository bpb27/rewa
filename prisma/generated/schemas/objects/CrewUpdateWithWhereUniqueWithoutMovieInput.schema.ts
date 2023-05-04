import { z } from 'zod';
import { CrewWhereUniqueInputObjectSchema } from './CrewWhereUniqueInput.schema';
import { CrewUpdateWithoutMovieInputObjectSchema } from './CrewUpdateWithoutMovieInput.schema';
import { CrewUncheckedUpdateWithoutMovieInputObjectSchema } from './CrewUncheckedUpdateWithoutMovieInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CrewUpdateWithWhereUniqueWithoutMovieInput> = z
  .object({
    where: z.lazy(() => CrewWhereUniqueInputObjectSchema),
    data: z.union([
      z.lazy(() => CrewUpdateWithoutMovieInputObjectSchema),
      z.lazy(() => CrewUncheckedUpdateWithoutMovieInputObjectSchema),
    ]),
  })
  .strict();

export const CrewUpdateWithWhereUniqueWithoutMovieInputObjectSchema = Schema;
