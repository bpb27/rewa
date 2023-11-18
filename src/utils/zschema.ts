import { z } from 'zod';

export const integer = z.coerce.number().int();

export const integerList = z
  .string()
  .transform(value => (value ? value.split(',') : []))
  .pipe(integer.array());

export const boolean = z.enum(['true', 'false']).transform(v => v === 'true');

export const zqp = {
  integer,
  integerList,
  boolean,
};
