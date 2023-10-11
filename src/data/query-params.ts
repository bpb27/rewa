import { useRouter } from 'next/router';
import { stringify } from 'qs';
import { omitBy, isArray, isNumber } from 'remeda';
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
  movie: integerList.optional().default(''),
  oscarCategory: integerList.optional().default(''),
  page: integer.optional().default(0),
  revenue: integerList.optional().default(''),
  runtime: integerList.optional().default(''),
  searchMode: z.enum(['and', 'or']).optional().default('and'),
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
  streamer: integerList.optional().default(''),
  year: integerList.optional().default(''),
  yearRange: integerList.optional().default(''),
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
  searchMode: 'and',
  page: 0,
  sort: 'title',
  movie: [],
  oscarCategory: [],
  revenue: [],
  runtime: [],
  streamer: [],
  year: [],
  yearRange: [],
};

const tokenSchema = qpSchema.pick({
  actor: true,
  budget: true,
  director: true,
  genre: true,
  host: true,
  movie: true,
  oscarCategory: true,
  revenue: true,
  runtime: true,
  streamer: true,
  year: true,
  yearRange: true,
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

export const useQueryParams = (defaultValues: QpSchema = defaultQps) => {
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
    if the target is an array, can specify one value in the array to toggle
    e.g. update('actor', 1)
  */

  const update = <TKey extends keyof QpSchema, TValue extends QpSchema[TKey]>(
    key: TKey,
    value: TValue extends any[] ? TValue[number] | TValue : TValue
  ) => {
    let newValues: QpSchema;
    const target = values[key];

    if (isArray(target) && isNumber(value)) {
      if (target.includes(value)) {
        newValues = { ...values, [key]: target.filter(v => v !== value) };
      } else {
        newValues = { ...values, [key]: [...target, value] };
      }
    } else {
      newValues = { ...values, [key]: value };
    }

    if (key !== 'page') {
      newValues.page = 0;
    }
    if (key === 'year') {
      newValues.yearRange = [];
    } else if (key === 'yearRange') {
      newValues.year = [];
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
