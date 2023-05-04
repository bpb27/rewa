import { z } from 'zod';
import { CrewScalarWhereInputObjectSchema } from './CrewScalarWhereInput.schema';
import { CrewUpdateManyMutationInputObjectSchema } from './CrewUpdateManyMutationInput.schema';
import { CrewUncheckedUpdateManyWithoutCrewInputObjectSchema } from './CrewUncheckedUpdateManyWithoutCrewInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CrewUpdateManyWithWhereWithoutMovieInput> = z
  .object({
    where: z.lazy(() => CrewScalarWhereInputObjectSchema),
    data: z.union([
      z.lazy(() => CrewUpdateManyMutationInputObjectSchema),
      z.lazy(() => CrewUncheckedUpdateManyWithoutCrewInputObjectSchema),
    ]),
  })
  .strict();

export const CrewUpdateManyWithWhereWithoutMovieInputObjectSchema = Schema;
