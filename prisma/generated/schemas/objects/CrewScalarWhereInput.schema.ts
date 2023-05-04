import { z } from 'zod';
import { BoolFilterObjectSchema } from './BoolFilter.schema';
import { IntFilterObjectSchema } from './IntFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { FloatFilterObjectSchema } from './FloatFilter.schema';

import type { Prisma } from '@prisma/client';

const Schema: z.ZodType<Prisma.CrewScalarWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => CrewScalarWhereInputObjectSchema),
        z.lazy(() => CrewScalarWhereInputObjectSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => CrewScalarWhereInputObjectSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => CrewScalarWhereInputObjectSchema),
        z.lazy(() => CrewScalarWhereInputObjectSchema).array(),
      ])
      .optional(),
    adult: z
      .union([z.lazy(() => BoolFilterObjectSchema), z.boolean()])
      .optional(),
    gender: z
      .union([z.lazy(() => IntFilterObjectSchema), z.number()])
      .optional(),
    known_for_department: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    name: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    original_name: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    popularity: z
      .union([z.lazy(() => FloatFilterObjectSchema), z.number()])
      .optional(),
    profile_path: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    credit_id: z
      .union([z.lazy(() => StringFilterObjectSchema), z.string()])
      .optional(),
    department: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    job: z
      .union([z.lazy(() => StringNullableFilterObjectSchema), z.string()])
      .optional()
      .nullable(),
    movie_id: z
      .union([z.lazy(() => IntFilterObjectSchema), z.number()])
      .optional(),
  })
  .strict();

export const CrewScalarWhereInputObjectSchema = Schema;
