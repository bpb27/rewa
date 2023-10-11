import { useRouter } from 'next/router';
import { stringify } from 'qs';
import { omitBy, isArray } from 'remeda';
import { z } from 'zod';
import { integer, integerList, boolean } from '~/utils/zschema';

export type QpSchema = z.infer<typeof qpSchema>;
export type TokenType = keyof z.infer<typeof tokenSchema>;
export type SortKey = QpSchema['sort'];

export const qpSchema = z.object({
  actor: integerList.optional().default(''),
  asc: boolean.optional().default('false'),
  budget: integerList.optional().default(''),
  director: integerList.optional().default(''),
  genre: integerList.optional().default(''),
  hasEpisode: boolean.optional().default('false'),
  hasOscar: boolean.optional().default('false'),
  host: integerList.optional().default(''),
  mode: z.enum(['and', 'or']).optional().default('and'),
  page: integer.optional().default(0),
  sort: z
    .enum([
      'budget',
      'director',
      'episodeNumber',
      'profit',
      'release_date',
      'revenue',
      'runtime',
      'title',
      'total_oscar_nominations',
      'total_oscar_wins',
    ])
    .optional()
    .default('title'),
  movie: integerList.optional().default(''),
  oscarCategories: integerList.optional().default(''),
  revenue: integerList.optional().default(''),
  runtime: integerList.optional().default(''),
  streamer: integerList.optional().default(''),
  year: integerList.optional().default(''),
  yearGte: integer.optional().default(0),
  yearLte: integer.optional().default(0),
});

export const defaultQps: QpSchema = {
  actor: [],
  asc: false,
  budget: [],
  director: [],
  genre: [],
  hasEpisode: false,
  hasOscar: false,
  host: [],
  mode: 'and',
  page: 0,
  sort: 'title',
  movie: [],
  oscarCategories: [],
  revenue: [],
  runtime: [],
  streamer: [],
  year: [],
  yearGte: 0,
  yearLte: 0,
};

const tokenSchema = qpSchema.pick({
  actor: true,
  budget: true,
  director: true,
  genre: true,
  host: true,
  movie: true,
  oscarCategories: true,
  revenue: true,
  runtime: true,
  streamer: true,
  year: true,
});

export const tokenKeys = Object.keys(tokenSchema.shape) as TokenType[];

export const qpParse = (search: object, defaultValues: QpSchema) => {
  const parsed = qpSchema.safeParse(search);
  return parsed.success ? parsed.data : defaultValues;
};

export const qpStringify = (
  search: Record<string, string | number | boolean | string[] | number[]>,
  path?: string
) => {
  const trimmed = omitBy(
    search,
    value => value === undefined || (Array.isArray(value) && !value.length)
  );
  const qpString = stringify(trimmed, { encode: false, arrayFormat: 'comma' });
  return path ? `${path.split('?')[0]}?${qpString}` : qpString;
};

export const useQueryParams = (defaultValues: QpSchema) => {
  const router = useRouter();
  const isEmpty = !router.asPath.split('?')[1]?.length;
  const values = isEmpty ? defaultValues : qpParse(router.query, defaultValues);
  const queryString = qpStringify({
    ...values,
    ...(router.asPath.includes('/rewa/') ? { hasEpisode: true } : undefined),
    ...(router.asPath.includes('/oscars/') ? { hasOscar: true } : undefined),
  });

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

    if (key !== 'page') {
      newValues.page = 0;
    }

    push(newValues);
  };

  const clearTokens = () => {
    const newValues = { ...values };
    tokenKeys.forEach(key => {
      newValues[key] = [];
    });
    push(newValues);
  };

  return {
    values,
    update,
    updateAll: push,
    clearTokens,
    queryString,
    isEmpty,
  };
};
