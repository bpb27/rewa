import { parse as qsParse, stringify as qsStringify } from 'qs';
import { isArray, isNumber } from 'remeda';
import { assign, createMachine, fromPromise } from 'xstate';
import { z } from 'zod';
import { ApiGetMoviesResponse } from '~/pages/api/movies';
import { parsePath } from '~/utils/format';
import { zqp } from '~/utils/zschema';
// import { qpParse } from './query-params';

export const qpSchema = z.object({
  actor: zqp.integerList.optional().default(''),
  asc: zqp.boolean.optional().default('false'),
  budget: zqp.integerList.optional().default(''),
  director: zqp.integerList.optional().default(''),
  genre: zqp.integerList.optional().default(''),
  hasEpisode: zqp.boolean.optional().default('false'),
  hasOscar: zqp.boolean.optional().default('false'),
  host: zqp.integerList.optional().default(''),
  keyword: zqp.integerList.optional().default(''),
  movie: zqp.integerList.optional().default(''),
  oscarsCategoriesNom: zqp.integerList.optional().default(''),
  oscarsCategoriesWon: zqp.integerList.optional().default(''),
  page: zqp.integer.optional().default(0),
  revenue: zqp.integerList.optional().default(''),
  runtime: zqp.integerList.optional().default(''),
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
  streamer: zqp.integerList.optional().default(''),
  year: zqp.integerList.optional().default(''),
  yearRange: zqp.integerList.optional().default(''),
});

type QpSchema = z.infer<typeof qpSchema>;

const fetchMovies = fromPromise<ApiGetMoviesResponse, string>(async ({ input }) => {
  const response = await fetch(`/api/movies?${parsePath(input).queryString}`);
  const data: ApiGetMoviesResponse = await response.json();
  return data;
});

type Actor = { src: 'fetchMovies'; logic: typeof fetchMovies };

type Context = {
  data: ApiGetMoviesResponse;
  push: (url: string) => void;
  queryParams: QpSchema;
  url: string;
};

type Event =
  | { type: 'URL_HAS_CHANGED'; url: string }
  | { type: 'UPDATE_URL'; queryParams: QpSchema };

type Input = Pick<Context, 'push' | 'url'>;

export const movieTableMachine = createMachine(
  {
    id: 'movieTable',
    initial: 'idle',
    types: {
      actors: {} as Actor,
      context: {} as Context,
      events: {} as Event,
      input: {} as Input,
    },
    context: ({ input }) => ({
      data: { hasNext: false, movies: [], page: 0, tokens: [], total: 0 },
      push: input.push,
      queryParams: qpSchema.parse(qsParse(input.url)),
      url: input.url,
    }),
    states: {
      idle: {
        on: {
          URL_HAS_CHANGED: {
            target: 'fetching',
            actions: assign(params => ({
              url: params.event.url,
              // TODO: probably better to put in a separate function
              queryParams: qpSchema.parse(qsParse(params.event.url)),
            })),
          },
          UPDATE_URL: {
            actions: ({ context, event }) => {
              const newUrl = `${parsePath(context.url)}?${qsStringify(event.queryParams)}`;
              context.push(newUrl);
            },
          },
        },
      },
      // events will miss if in fetching state - maybe parallel?
      fetching: {
        invoke: {
          src: 'fetchMovies',
          input: ({ context }) => context.url,
          onDone: [
            // TODO: this should be elsewhere
            {
              guard: ({ context }) => context.data.page > 0 && context.data.movies.length === 0,
              target: 'idle',
              actions: {
                type: 'updateQueryParam',
                params: { field: 'page', value: 0 },
              },
            },
            {
              target: 'idle',
              actions: {
                type: 'storeUpdatedMovieResponse',
                params: ({ context, event }) => ({
                  ...event.output,
                  movies:
                    event.output.page > 0
                      ? [...context.data.movies, ...event.output.movies]
                      : event.output.movies,
                }),
              },
            },
          ],
          onError: 'idle',
        },
      },
    },
  },
  {
    actors: { fetchMovies },
  }
);

// MEH maybe just change 'UPDATE_URL' to Partial<QqSchema> and filter or merge arrays

export const movieTableMachineWrapper = ({
  context,
  send,
}: {
  context: Context;
  send: (event: Event) => void;
}) => {
  const update = <TKey extends keyof QpSchema, TValue extends QpSchema[TKey]>(
    key: TKey,
    value: TValue extends any[] ? TValue[number] | TValue : TValue
  ) => {
    const currentValues = context.queryParams;
    const target = currentValues[key];
    let newValues: QpSchema;

    if (isArray(target) && isNumber(value) && target.includes(value)) {
      newValues = { ...currentValues, [key]: target.filter(v => v !== value) };
    } else if (isArray(target) && isNumber(value)) {
      newValues = { ...currentValues, [key]: [...target, value] };
    } else {
      newValues = { ...currentValues, [key]: value };
    }

    if (key !== 'page') {
      newValues.page = 0;
    }

    send({ type: 'UPDATE_URL', queryParams: newValues });
  };

  const onUrlUpdate = (url: string) => {
    send({ type: 'URL_HAS_CHANGED', url });
  };

  const getNextPage = (page: number) => {
    send({ type: 'UPDATE_URL', queryParams: { ...context.queryParams, page } });
  };

  return { update, onUrlUpdate, getNextPage };
};
