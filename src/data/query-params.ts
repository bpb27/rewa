import { parse as qsParse, stringify as qsStringify } from 'qs';
import { omitBy } from 'remeda';
import { z } from 'zod';
import { appEnums } from '~/utils/enums';
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
export type QpParsed = z.infer<typeof parsedQpSchema>;

// transforms query param string values into proper types
export const qpSchema = z.object({
  actor: integerList.optional().default(''),
  asc: boolean.optional().default('false'),
  budget: integerList.optional().default(''),
  budgetGte: integerList.optional().default(''),
  budgetLte: integerList.optional().default(''),
  cinematographer: integerList.optional().default(''),
  director: integerList.optional().default(''),
  genre: integerList.optional().default(''),
  host: integerList.optional().default(''),
  keyword: integerList.optional().default(''),
  movie: integerList.optional().default(''),
  movieMode: appEnums.movieMode.schema.optional().default('any'),
  oscarsCategoriesNom: integerList.optional().default(''),
  oscarsCategoriesWon: integerList.optional().default(''),
  page: integer.optional().default(0),
  producer: integerList.optional().default(''),
  revenue: integerList.optional().default(''),
  revenueGte: integerList.optional().default(''),
  revenueLte: integerList.optional().default(''),
  runtime: integerList.optional().default(''),
  runtimeGte: integerList.optional().default(''),
  runtimeLte: integerList.optional().default(''),
  searchMode: appEnums.searchMode.schema.optional().default('and'),
  sort: appEnums.sort.schema.optional().default('title'),
  streamer: integerList.optional().default(''),
  writer: integerList.optional().default(''),
  year: integerList.optional().default(''),
  yearGte: integerList.optional().default(''),
  yearLte: integerList.optional().default(''),
});

const idList = z.array(z.number());

export const parsedQpSchema = z.object({
  actor: idList,
  asc: z.boolean(),
  budget: idList,
  budgetGte: idList,
  budgetLte: idList,
  cinematographer: idList,
  director: idList,
  genre: idList,
  host: idList,
  keyword: idList,
  movie: idList,
  movieMode: qpSchema.shape.movieMode,
  oscarsCategoriesNom: idList,
  oscarsCategoriesWon: idList,
  page: z.number(),
  producer: idList,
  revenue: idList,
  revenueGte: idList,
  revenueLte: idList,
  runtime: idList,
  runtimeGte: idList,
  runtimeLte: idList,
  searchMode: qpSchema.shape.searchMode,
  sort: qpSchema.shape.sort,
  streamer: idList,
  writer: idList,
  year: idList,
  yearGte: idList,
  yearLte: idList,
});

export const defaultQps: QpParsed = qpSchema.parse({});
