import { z } from 'zod';

export const getDefaults = <Schema extends z.AnyZodObject>(schema: Schema): z.infer<Schema> =>
  Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) =>
      value instanceof z.ZodDefault ? [key, value._def.defaultValue()] : [key, undefined]
    )
  );

export const integer = z.coerce.number().int();

export const integerList = z
  .string()
  .transform(value => (value ? value.split(',') : []))
  .pipe(integer.array());

export const boolean = z.enum(['true', 'false']).transform(v => v === 'true');
