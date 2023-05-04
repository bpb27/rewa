import { z } from 'zod';
import { CrewCreateWithoutMovieInputObjectSchema } from './CrewCreateWithoutMovieInput.schema';
import { CrewUncheckedCreateWithoutMovieInputObjectSchema } from './CrewUncheckedCreateWithoutMovieInput.schema';
import { CrewCreateOrConnectWithoutMovieInputObjectSchema } from './CrewCreateOrConnectWithoutMovieInput.schema';
import { CrewUpsertWithWhereUniqueWithoutMovieInputObjectSchema } from './CrewUpsertWithWhereUniqueWithoutMovieInput.schema';
import { CrewWhereUniqueInputObjectSchema } from './CrewWhereUniqueInput.schema';
import { CrewUpdateWithWhereUniqueWithoutMovieInputObjectSchema } from './CrewUpdateWithWhereUniqueWithoutMovieInput.schema';
import { CrewUpdateManyWithWhereWithoutMovieInputObjectSchema } from './CrewUpdateManyWithWhereWithoutMovieInput.schema';
import { CrewScalarWhereInputObjectSchema } from './CrewScalarWhereInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CrewUpdateManyWithoutMovieNestedInput> = z
  .object({
    create: z
      .union([
        z.lazy(() => CrewCreateWithoutMovieInputObjectSchema),
        z.lazy(() => CrewCreateWithoutMovieInputObjectSchema).array(),
        z.lazy(() => CrewUncheckedCreateWithoutMovieInputObjectSchema),
        z.lazy(() => CrewUncheckedCreateWithoutMovieInputObjectSchema).array(),
      ])
      .optional(),
    connectOrCreate: z
      .union([
        z.lazy(() => CrewCreateOrConnectWithoutMovieInputObjectSchema),
        z.lazy(() => CrewCreateOrConnectWithoutMovieInputObjectSchema).array(),
      ])
      .optional(),
    upsert: z
      .union([
        z.lazy(() => CrewUpsertWithWhereUniqueWithoutMovieInputObjectSchema),
        z
          .lazy(() => CrewUpsertWithWhereUniqueWithoutMovieInputObjectSchema)
          .array(),
      ])
      .optional(),
    set: z
      .union([
        z.lazy(() => CrewWhereUniqueInputObjectSchema),
        z.lazy(() => CrewWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    disconnect: z
      .union([
        z.lazy(() => CrewWhereUniqueInputObjectSchema),
        z.lazy(() => CrewWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    delete: z
      .union([
        z.lazy(() => CrewWhereUniqueInputObjectSchema),
        z.lazy(() => CrewWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    connect: z
      .union([
        z.lazy(() => CrewWhereUniqueInputObjectSchema),
        z.lazy(() => CrewWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
    update: z
      .union([
        z.lazy(() => CrewUpdateWithWhereUniqueWithoutMovieInputObjectSchema),
        z
          .lazy(() => CrewUpdateWithWhereUniqueWithoutMovieInputObjectSchema)
          .array(),
      ])
      .optional(),
    updateMany: z
      .union([
        z.lazy(() => CrewUpdateManyWithWhereWithoutMovieInputObjectSchema),
        z
          .lazy(() => CrewUpdateManyWithWhereWithoutMovieInputObjectSchema)
          .array(),
      ])
      .optional(),
    deleteMany: z
      .union([
        z.lazy(() => CrewScalarWhereInputObjectSchema),
        z.lazy(() => CrewScalarWhereInputObjectSchema).array(),
      ])
      .optional(),
  })
  .strict();

export const CrewUpdateManyWithoutMovieNestedInputObjectSchema = Schema;
