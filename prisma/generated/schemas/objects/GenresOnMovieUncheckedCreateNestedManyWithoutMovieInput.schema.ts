import { z } from 'zod';
import { GenresOnMovieCreateWithoutMovieInputObjectSchema } from './GenresOnMovieCreateWithoutMovieInput.schema';
import { GenresOnMovieUncheckedCreateWithoutMovieInputObjectSchema } from './GenresOnMovieUncheckedCreateWithoutMovieInput.schema';
import { GenresOnMovieCreateOrConnectWithoutMovieInputObjectSchema } from './GenresOnMovieCreateOrConnectWithoutMovieInput.schema';
import { GenresOnMovieWhereUniqueInputObjectSchema } from './GenresOnMovieWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenresOnMovieUncheckedCreateNestedManyWithoutMovieInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => GenresOnMovieCreateWithoutMovieInputObjectSchema),
          z
            .lazy(() => GenresOnMovieCreateWithoutMovieInputObjectSchema)
            .array(),
          z.lazy(
            () => GenresOnMovieUncheckedCreateWithoutMovieInputObjectSchema,
          ),
          z
            .lazy(
              () => GenresOnMovieUncheckedCreateWithoutMovieInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(
            () => GenresOnMovieCreateOrConnectWithoutMovieInputObjectSchema,
          ),
          z
            .lazy(
              () => GenresOnMovieCreateOrConnectWithoutMovieInputObjectSchema,
            )
            .array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => GenresOnMovieWhereUniqueInputObjectSchema),
          z.lazy(() => GenresOnMovieWhereUniqueInputObjectSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const GenresOnMovieUncheckedCreateNestedManyWithoutMovieInputObjectSchema =
  Schema;
