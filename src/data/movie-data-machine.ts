import { StateFrom, assign, createMachine, fromPromise, raise } from 'xstate';
import { trpcVanilla } from '~/trpc/client';
import { ApiResponses } from '~/trpc/router';
import {
  QpParsed,
  QpSchema,
  SortKey,
  TokenType,
  assembleUrl,
  qpSchema,
  tokenKeys,
  urlToParsedParams,
  urlToQueryString,
} from './query-params';
import { Token } from './tokens';

export type FetchMoviesResponse = ApiResponses['getMovies'];

const fetchMovies = fromPromise<FetchMoviesResponse, QpParsed>(async ({ input }) => {
  const [movies, tokens] = await Promise.all([
    trpcVanilla.getMovies.query(input),
    trpcVanilla.getTokens.query(input),
  ]);
  return { ...movies, ...tokens };
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
  data: FetchMoviesResponse;
  preloaded: { data: FetchMoviesResponse; url: string };
  push: (url: string) => void;
  queryParams: QpParsed;
  url: string;
};

type Event =
  | { type: 'CLEAR_ALL_TOKENS' }
  | { type: 'GET_NEXT_PAGE' }
  | { type: 'SORT'; field: QpSchema['sort'] }
  | { type: 'TOGGLE_SEARCH_MODE' }
  | { type: 'TOGGLE_SORT_ORDER' }
  | { type: 'TOGGLE_TOKEN'; name: TokenType; value: number }
  | { type: 'REPLACE_TOKEN'; name: TokenType; value: number }
  | { type: 'REMOVE_TOKEN'; name: TokenType }
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
          REPLACE_TOKEN: {
            actions: ({ context, event }) => {
              const { name, value } = event;
              updateUrl(context, { [name]: [value] });
            },
          },
          REMOVE_TOKEN: {
            actions: ({ context, event }) => {
              const { name } = event;
              updateUrl(context, { [name]: [] });
            },
          },
          SORT: {
            actions: ({ context, event }) => {
              const sort = event.field;
              const asc = !context.queryParams.asc;
              if (context.queryParams.sort !== sort) {
                updateUrl(context, { sort });
              } else {
                updateUrl(context, { asc });
              }
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
            actions: raise(({ event }) => event),
          },
        },
        invoke: {
          src: 'fetchMovies',
          input: ({ context }) => context.queryParams,
          onDone: {
            target: 'idle',
            actions: assign(({ context, event }) => {
              // TODO: xstate isn't picking up on output type for some reason
              const data: FetchMoviesResponse = { ...event.output };
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
    movieMode: queryParams.movieMode,
    movies: data.movies,
    oscarsCategoriesNom: queryParams.oscarsCategoriesNom,
    oscarsCategoriesWon: queryParams.oscarsCategoriesWon,
    searchMode: queryParams.searchMode,
    showVizSensor: state.matches('idle') && data.hasNext && data.movies.length > 0,
    sort: queryParams.sort,
    tokens: data.tokens,
    total: data.total,
    ranges: {
      budgetGte: queryParams.budgetGte[0]?.toString() || '',
      budgetLte: queryParams.budgetLte[0]?.toString() || '',
      revenueGte: queryParams.revenueGte[0]?.toString() || '',
      revenueLte: queryParams.revenueLte[0]?.toString() || '',
      runtimeGte: queryParams.runtimeGte[0]?.toString() || '',
      runtimeLte: queryParams.runtimeLte[0]?.toString() || '',
      yearGte: queryParams.yearGte[0]?.toString() || '',
      yearLte: queryParams.yearLte[0]?.toString() || '',
    },
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
  removeToken: (tokenType: Token['type']) => {
    send({ type: 'REMOVE_TOKEN', name: tokenType });
  },
  replaceToken: (token: Omit<Token, 'name'>) => {
    send({ type: 'REPLACE_TOKEN', name: token.type, value: token.id });
  },
  sort: (field: SortKey) => {
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
