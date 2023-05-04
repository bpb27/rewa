import { z } from 'zod';
import { MovieWhereUniqueInputObjectSchema } from './MovieWhereUniqueInput.schema';
import { MovieCreateWithoutGenresInputObjectSchema } from './MovieCreateWithoutGenresInput.schema';
import { MovieUncheckedCreateWithoutGenresInputObjectSchema } from './MovieUncheckedCreateWithoutGenresInput.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.MovieCreateOrConnectWithoutGenresInput> = z
  .object({
    where: z.lazy(() => MovieWhereUniqueInputObjectSchema),
    create: z.union([
      z.lazy(() => MovieCreateWithoutGenresInputObjectSchema),
      z.lazy(() => MovieUncheckedCreateWithoutGenresInputObjectSchema),
    ]),
  })
  .strict();

export const MovieCreateOrConnectWithoutGenresInputObjectSchema = Schema;
