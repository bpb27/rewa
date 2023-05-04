import { z } from 'zod';
import { CrewCreateWithoutMovieInputObjectSchema } from './CrewCreateWithoutMovieInput.schema';
import { CrewUncheckedCreateWithoutMovieInputObjectSchema } from './CrewUncheckedCreateWithoutMovieInput.schema';
import { CrewCreateOrConnectWithoutMovieInputObjectSchema } from './CrewCreateOrConnectWithoutMovieInput.schema';
import { CrewWhereUniqueInputObjectSchema } from './CrewWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CrewUncheckedCreateNestedManyWithoutMovieInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => CrewCreateWithoutMovieInputObjectSchema),
          z.lazy(() => CrewCreateWithoutMovieInputObjectSchema).array(),
          z.lazy(() => CrewUncheckedCreateWithoutMovieInputObjectSchema),
          z
            .lazy(() => CrewUncheckedCreateWithoutMovieInputObjectSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => CrewCreateOrConnectWithoutMovieInputObjectSchema),
          z
            .lazy(() => CrewCreateOrConnectWithoutMovieInputObjectSchema)
            .array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => CrewWhereUniqueInputObjectSchema),
          z.lazy(() => CrewWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const CrewUncheckedCreateNestedManyWithoutMovieInputObjectSchema =
  Schema;
