import { z } from 'zod';
import { GenreCreateWithoutMoviesInputObjectSchema } from './GenreCreateWithoutMoviesInput.schema';
import { GenreUncheckedCreateWithoutMoviesInputObjectSchema } from './GenreUncheckedCreateWithoutMoviesInput.schema';
import { GenreCreateOrConnectWithoutMoviesInputObjectSchema } from './GenreCreateOrConnectWithoutMoviesInput.schema';
import { GenreWhereUniqueInputObjectSchema } from './GenreWhereUniqueInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenreCreateNestedOneWithoutMoviesInput> = z
  .object({
    create: z
      .union([
        z.lazy(() => GenreCreateWithoutMoviesInputObjectSchema),
        z.lazy(() => GenreUncheckedCreateWithoutMoviesInputObjectSchema),
      ])
      .optional(),
    connectOrCreate: z
      .lazy(() => GenreCreateOrConnectWithoutMoviesInputObjectSchema)
      .optional(),
    connect: z.lazy(() => GenreWhereUniqueInputObjectSchema).optional(),
  })
  .strict();

export const GenreCreateNestedOneWithoutMoviesInputObjectSchema = Schema;
