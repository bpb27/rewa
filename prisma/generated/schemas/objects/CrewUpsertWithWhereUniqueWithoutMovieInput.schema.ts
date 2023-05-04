import { z } from 'zod';
import { CrewWhereUniqueInputObjectSchema } from './CrewWhereUniqueInput.schema';
import { CrewUpdateWithoutMovieInputObjectSchema } from './CrewUpdateWithoutMovieInput.schema';
import { CrewUncheckedUpdateWithoutMovieInputObjectSchema } from './CrewUncheckedUpdateWithoutMovieInput.schema';
import { CrewCreateWithoutMovieInputObjectSchema } from './CrewCreateWithoutMovieInput.schema';
import { CrewUncheckedCreateWithoutMovieInputObjectSchema } from './CrewUncheckedCreateWithoutMovieInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CrewUpsertWithWhereUniqueWithoutMovieInput> = z
  .object({
    where: z.lazy(() => CrewWhereUniqueInputObjectSchema),
    update: z.union([
      z.lazy(() => CrewUpdateWithoutMovieInputObjectSchema),
      z.lazy(() => CrewUncheckedUpdateWithoutMovieInputObjectSchema),
    ]),
    create: z.union([
      z.lazy(() => CrewCreateWithoutMovieInputObjectSchema),
      z.lazy(() => CrewUncheckedCreateWithoutMovieInputObjectSchema),
    ]),
  })
  .strict();

export const CrewUpsertWithWhereUniqueWithoutMovieInputObjectSchema = Schema;
