import { StateFrom, assign, createMachine, fromPromise, raise } from 'xstate';
import { ApiGetMoviesResponse } from '~/pages/api/movies';
import {
  QpSchema,
  TokenType,
  assembleUrl,
  qpSchema,
  tokenKeys,
  urlToParsedParams,
  urlToQueryString,
} from './query-params';
import { Token } from './tokens';

const fetchMovies = fromPromise<ApiGetMoviesResponse, string>(async ({ input }) => {
  const response = await fetch(`/api/movies?${urlToQueryString(input)}`);
  const data: ApiGetMoviesResponse = await response.json();
  return data;
});

const updateUrl = (context: Context, newQueryParams: Partial<QpSchema>) => {
  const newUrl = assembleUrl(context.url, {
    ...context.queryParams,
    ...newQueryParams,
    page: newQueryParams.page === undefined ? 0 : newQueryParams.page,
  });
  context.push(newUrl);
};

type Actor = { src: 'fetchMovies'; logic: typeof fetchMovies };

type Context = {
  data: ApiGetMoviesResponse;
  preloaded: { data: ApiGetMoviesResponse; url: string };
  push: (url: string) => void;
  queryParams: QpSchema;
  url: string;
};

type Event =
  | { type: 'CLEAR_ALL_TOKENS' }
  | { type: 'GET_NEXT_PAGE' }
  | { type: 'SORT'; field: QpSchema['sort'] }
  | { type: 'TOGGLE_SEARCH_MODE' }
  | { type: 'TOGGLE_SORT_ORDER' }
  | { type: 'TOGGLE_TOKEN'; name: TokenType; value: number }
  | { type: 'URL_HAS_CHANGED'; url: string };

type Input = Pick<Context, 'push' | 'url' | 'preloaded'>;

export const movieTableMachine = createMachine(
  {
    id: 'movieTable',
    initial: 'setup',
    types: {
      actors: {} as Actor,
      context: {} as Context,
      events: {} as Event,
      input: {} as Input,
    },
    context: ({ input }) => ({
      data: { hasNext: false, movies: [], page: 0, tokens: [], total: 0 },
      preloaded: input.preloaded,
      push: input.push,
      queryParams: urlToParsedParams(input.url, qpSchema),
      url: input.url,
    }),
    states: {
      setup: {
        always: [
          {
            guard: ({ context }) => urlToQueryString(context.url).length === 0,
            actions: assign(({ context }) => ({
              url: context.preloaded.url,
              data: context.preloaded.data,
              queryParams: urlToParsedParams(context.preloaded.url, qpSchema),
            })),
            target: 'idle',
          },
          {
            guard: ({ context }) => context.queryParams.page > 0 && !context.data.movies.length,
            actions: ({ context }) => updateUrl(context, { page: 0 }),
            target: 'idle',
          },
          { target: 'idle' },
        ],
      },
      idle: {
        on: {
          URL_HAS_CHANGED: {
            guard: ({ event }) => urlToQueryString(event.url).length > 0,
            target: 'fetching',
            actions: assign(({ event }) => ({
              url: event.url,
              queryParams: urlToParsedParams(event.url, qpSchema),
            })),
          },
          CLEAR_ALL_TOKENS: {
            actions: ({ context }) => {
              const cleared = tokenKeys.reduce((acc, key) => ({ ...acc, [key]: [] }), {});
              updateUrl(context, cleared);
            },
          },
          GET_NEXT_PAGE: {
            guard: ({ context }) => context.data.hasNext,
            actions: ({ context }) => {
              const page = context.data.page + 1;
              updateUrl(context, { page });
            },
          },
          SORT: {
            actions: ({ context, event }) => {
              const sort = event.field;
              updateUrl(context, { sort });
            },
          },
          TOGGLE_SEARCH_MODE: {
            actions: ({ context }) => {
              const searchMode = context.queryParams.searchMode === 'and' ? 'or' : 'and';
              updateUrl(context, { searchMode });
            },
          },
          TOGGLE_SORT_ORDER: {
            actions: ({ context }) => {
              const asc = !context.queryParams.asc;
              updateUrl(context, { asc });
            },
          },
          TOGGLE_TOKEN: {
            actions: ({ context, event }) => {
              const { name, value } = event;
              const current = context.queryParams[name];
              const updated = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];
              updateUrl(context, { [name]: updated.sort() });
            },
          },
        },
      },
      fetching: {
        on: {
          '*': {
            target: 'idle',
            actions: [
              raise(({ event }) => event),
              ({ event }) => console.log('canceling fetch and forwarding', event),
            ],
          },
        },
        invoke: {
          src: 'fetchMovies',
          input: ({ context }) => context.url,
          onDone: {
            target: 'idle',
            actions: assign(({ context, event }) => {
              const data = { ...event.output };
              if (data.page > 0) data.movies = [...context.data.movies, ...data.movies];
              return { data };
            }),
          },
          onError: 'idle',
        },
      },
    },
  },
  {
    actors: { fetchMovies },
  }
);

// abstracting machine context structure for easy component consumption
export const movieTableData = (state: StateFrom<typeof movieTableMachine>) => {
  const { data, queryParams } = state.context;
  return {
    asc: queryParams.asc,
    hasTokens: data.tokens.length > 0,
    mode: queryParams.hasEpisode ? ('episode' as const) : ('oscar' as const),
    movies: data.movies,
    oscarsCategoriesNom: queryParams.oscarsCategoriesNom,
    oscarsCategoriesWon: queryParams.oscarsCategoriesWon,
    searchMode: queryParams.searchMode,
    showVizSensor: state.matches('idle') && data.hasNext && data.movies.length > 0,
    sort: queryParams.sort,
    tokens: data.tokens,
    total: data.total,
  };
};

// abstracting machine events for easy component consumption
export const movieTableActions = (send: (event: Event) => void) => ({
  clearTokens: () => {
    send({ type: 'CLEAR_ALL_TOKENS' });
  },
  nextPage: () => {
    send({ type: 'GET_NEXT_PAGE' });
  },
  onUrlUpdate: (url: string) => {
    send({ type: 'URL_HAS_CHANGED', url });
  },
  sort: (field: QpSchema['sort']) => {
    send({ type: 'SORT', field });
  },
  toggleSearchMode: () => {
    send({ type: 'TOGGLE_SEARCH_MODE' });
  },
  toggleSortOrder: () => {
    send({ type: 'TOGGLE_SORT_ORDER' });
  },
  toggleToken: (token: Omit<Token, 'name'>) => {
    send({ type: 'TOGGLE_TOKEN', name: token.type, value: token.id });
  },
});
