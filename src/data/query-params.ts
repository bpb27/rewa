import { useRouter } from 'next/router';
import { stringify } from 'qs';
import { omitBy, isArray, pick } from 'remeda';
import { z } from 'zod';
import { integer, integerList, boolean } from '~/utils/zschema';
import { TokenType, tokenSchema } from './tokens';

export type QpSchema = z.infer<typeof qpSchema>;
export type SortKey = QpSchema['sort'];

export const sortSchema = z.enum([
  'budget',
  'director',
  'episodeNumber',
  'profit',
  'release_date',
  'revenue',
  'runtime',
  'title',
]);

export const qpSchema = z.object({
  actor: integerList.optional().default(''),
  amount: integer.optional().default(20),
  asc: boolean.optional().default('false'),
  budget: integerList.optional().default(''),
  director: integerList.optional().default(''),
  genre: integerList.optional().default(''),
  host: integerList.optional().default(''),
  mode: z.enum(['and', 'or']).optional().default('or'),
  sort: sortSchema.optional().default('episodeNumber'),
  movie: integerList.optional().default(''),
  revenue: integerList.optional().default(''),
  runtime: integerList.optional().default(''),
  streamer: integerList.optional().default(''),
  year: integerList.optional().default(''),
});

export const defaultQps: QpSchema = {
  actor: [],
  amount: 20,
  asc: false,
  budget: [],
  director: [],
  genre: [],
  host: [],
  mode: 'or',
  sort: 'episodeNumber',
  movie: [],
  revenue: [],
  runtime: [],
  streamer: [],
  year: [],
};

export const qpTokenKeys = [
  'actor',
  'budget',
  'director',
  'genre',
  'host',
  'movie',
  'revenue',
  'runtime',
  'streamer',
  'year',
] satisfies (keyof QpSchema)[] & TokenType[];

export const tokenQps = (qps: QpSchema) => pick(qps, qpTokenKeys);

export const qpParse = (search: object) => {
  const parsed = qpSchema.safeParse(search);
  return parsed.success ? parsed.data : defaultQps;
};

export const qpStringify = (search: QpSchema, path?: string) => {
  const trimmed = omitBy(
    search,
    value => value === undefined || (Array.isArray(value) && !value.length)
  );
  const qpString = stringify(trimmed, { encode: false, arrayFormat: 'comma' });
  return path ? `${path.split('?')[0]}?${qpString}` : qpString;
};

export const useQueryParams = () => {
  const router = useRouter();
  const values = qpParse(router.query);
  const queryString = qpStringify(values);

  const push = (newValues: QpSchema) => {
    router.replace(qpStringify(newValues, router.asPath), undefined, {
      shallow: true,
      scroll: false,
    });
  };

  /*
    if the target is an array, specify one value in the array to toggle
    e.g. update('actor', 1)
    otherwise just change the direct value
    e.g. update('sort', 'title')
  */

  const update = <TKey extends keyof QpSchema, TValue extends QpSchema[TKey]>(
    key: TKey,
    value: TValue extends any[] ? TValue[number] : TValue
  ) => {
    let newValues: QpSchema;
    const target = values[key];

    if (isArray(target) && target.includes(value as number)) {
      newValues = { ...values, [key]: target.filter(v => v !== value) };
    } else if (isArray(target)) {
      newValues = { ...values, [key]: [...target, value] };
    } else {
      newValues = { ...values, [key]: value };
    }

    if (key !== 'amount') {
      newValues.amount = 20;
    }

    push(newValues);
  };

  const clearTokens = () => {
    const newValues = { ...values };
    tokenSchema.options.forEach(key => {
      newValues[key] = [];
    });
    push(newValues);
  };

  return {
    values,
    update,
    clearTokens,
    queryString,
    noUrlValues: !router.asPath.split('?')[1]?.length,
  };
};
