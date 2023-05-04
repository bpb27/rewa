import { z } from 'zod';
import { CastCreateWithoutMovieInputObjectSchema } from './CastCreateWithoutMovieInput.schema';
import { CastUncheckedCreateWithoutMovieInputObjectSchema } from './CastUncheckedCreateWithoutMovieInput.schema';
import { CastCreateOrConnectWithoutMovieInputObjectSchema } from './CastCreateOrConnectWithoutMovieInput.schema';
import { CastWhereUniqueInputObjectSchema } from './CastWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CastCreateNestedManyWithoutMovieInput> = z
  .object({
    create: z
      .union([
        z.lazy(() => CastCreateWithoutMovieInputObjectSchema),
        z.lazy(() => CastCreateWithoutMovieInputObjectSchema).array(),
        z.lazy(() => CastUncheckedCreateWithoutMovieInputObjectSchema),
        z.lazy(() => CastUncheckedCreateWithoutMovieInputObjectSchema).array(),
      ])
      .optional(),
    connectOrCreate: z
      .union([
        z.lazy(() => CastCreateOrConnectWithoutMovieInputObjectSchema),
        z.lazy(() => CastCreateOrConnectWithoutMovieInputObjectSchema).array(),
      ])
      .optional(),
    connect: z
      .union([
        z.lazy(() => CastWhereUniqueInputObjectSchema),
        z.lazy(() => CastWhereUniqueInputObjectSchema).array(),
      ])
      .optional(),
  })
  .strict();

export const CastCreateNestedManyWithoutMovieInputObjectSchema = Schema;
