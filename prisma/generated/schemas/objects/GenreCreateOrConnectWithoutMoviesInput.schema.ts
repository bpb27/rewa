import { z } from 'zod';
import { GenreWhereUniqueInputObjectSchema } from './GenreWhereUniqueInput.schema';
import { GenreCreateWithoutMoviesInputObjectSchema } from './GenreCreateWithoutMoviesInput.schema';
import { GenreUncheckedCreateWithoutMoviesInputObjectSchema } from './GenreUncheckedCreateWithoutMoviesInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.GenreCreateOrConnectWithoutMoviesInput> = z
  .object({
    where: z.lazy(() => GenreWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => GenreCreateWithoutMoviesInputObjectSchema),
      z.lazy(() => GenreUncheckedCreateWithoutMoviesInputObjectSchema),
    ]),
  })
  .strict();

export const GenreCreateOrConnectWithoutMoviesInputObjectSchema = Schema;
