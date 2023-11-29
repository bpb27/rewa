import { parse as qsParse, stringify as qsStringify } from 'qs';
import { omitBy } from 'remeda';
import { z } from 'zod';
import { boolean, integer, integerList } from '~/utils/zschema';

export const urlToQueryString = (url: string) => url.split('?')[1] || '';

export const urlToPathString = (url: string) => url.split('?')[0] || '';

export const urlToParsedParams = <TSchema extends z.AnyZodObject>(
  url: string,
  schema: TSchema
): z.infer<TSchema> => {
  const result = schema.safeParse(qsParse(urlToQueryString(url)));
  return result.success ? result.data : schema.parse({});
};

export const assembleUrl = (
  url: string,
  params: Record<string, string | number | boolean | string[] | number[]>
) => {
  const trimmed = omitBy(
    params,
    value => value === undefined || (Array.isArray(value) && !value.length)
  );
  const qpString = qsStringify(trimmed, { encode: false, arrayFormat: 'comma' });
  return `${urlToPathString(url)}?${qpString}`;
};

export type QpSchema = z.infer<typeof qpSchema>;
export type TokenType = keyof z.infer<typeof tokenSchema>;
export type SortKey = QpSchema['sort'];

export const qpSchema = z.object({
  actor: integerList.optional().default(''),
  asc: boolean.optional().default('false'),
  budget: integerList.optional().default(''),
  cinematographer: integerList.optional().default(''),
  director: integerList.optional().default(''),
  genre: integerList.optional().default(''),
  host: integerList.optional().default(''),
  keyword: integerList.optional().default(''),
  movie: integerList.optional().default(''),
  movieMode: z.enum(['rewa', 'oscar']).optional().default('rewa'),
  oscarsCategoriesNom: integerList.optional().default(''),
  oscarsCategoriesWon: integerList.optional().default(''),
  page: integer.optional().default(0),
  producer: integerList.optional().default(''),
  revenue: integerList.optional().default(''),
  runtime: integerList.optional().default(''),
  searchMode: z.enum(['and', 'or']).optional().default('and'),
  sort: z
    .enum([
      'budget',
      'director',
      'ebert',
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
  writer: integerList.optional().default(''),
  year: integerList.optional().default(''),
});

export const defaultQps = qpSchema.parse({});

// adding a new token? make sure to update api/get-tokens.ts so they'll display
const tokenSchema = qpSchema.pick({
  actor: true,
  budget: true,
  cinematographer: true,
  director: true,
  genre: true,
  host: true,
  keyword: true,
  movie: true,
  oscarsCategoriesNom: true,
  oscarsCategoriesWon: true,
  producer: true,
  revenue: true,
  runtime: true,
  streamer: true,
  writer: true,
  year: true,
});

export const tokenKeys = Object.keys(tokenSchema.shape) as TokenType[];
