import { useMachine } from '@xstate/react';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { StateFrom, assign, createMachine, fromPromise, raise } from 'xstate';
import { trpcVanilla } from '~/trpc/client';
import { ApiResponses } from '~/trpc/router';
import { appEnums, type AppEnums } from '~/utils/enums';
import { useUrlChange } from '~/utils/use-url-change';
import {
  QpParsed,
  QpSchema,
  TokenType,
  assembleUrl,
  qpSchema,
  tokenKeys,
  urlToParsedParams,
  urlToQueryString,
} from './query-params';
import { type Token } from './tokens';

type Results = {
  page: number;
  total: number;
  hasNext: boolean;
  /** reusable machine can store different result types, specify via useQueryParamsMachine hook */
  results: unknown[];
  tokens: Token[];
};

type Context = {
  data: Results;
  preloaded: { data: Results; url: string };
  push: (url: string) => void;
  queryParams: QpParsed;
  url: string;
};

type Event =
  | { type: 'CLEAR_ALL_TOKENS' }
  | { type: 'CLEAR_BY_TOKEN_TYPE'; name: TokenType }
  | { type: 'GET_NEXT_PAGE' }
  | { type: 'SORT'; field: AppEnums['sort'] }
  | { type: 'TOGGLE_SEARCH_MODE' }
  | { type: 'TOGGLE_SORT_ORDER' }
  | { type: 'TOGGLE_TOKEN'; name: TokenType; value: number }
  | { type: 'REPLACE_TOKEN'; name: TokenType; value: number }
  | { type: 'REMOVE_TOKEN'; name: TokenType; value: number }
  | { type: 'URL_HAS_CHANGED'; url: string };

type Input = Pick<Context, 'push' | 'url' | 'preloaded'>;

type Variant = 'movies' | 'leaderboard';

type FetchResponse<T extends Variant> = T extends 'movies'
  ? ApiResponses['getMovies']['results']
  : T extends 'leaderboard'
  ? ApiResponses['getLeaderboard']['results']
  : never;

const updateUrl = (context: Context, newQueryParams: Partial<QpSchema>) => {
  const newUrl = assembleUrl(context.url, {
    ...context.queryParams,
    ...newQueryParams,
    page: newQueryParams.page === undefined ? 0 : newQueryParams.page,
  });
  context.push(newUrl);
};

const fetchMovies = fromPromise<Results, Context>(async ({ input }) => {
  return trpcVanilla.getMovies.query(input.queryParams);
});

const fetchLeaderboard = fromPromise<Results, Context>(async ({ input }) => {
  // TODO: this is fragile, should find a better way
  const field = appEnums.topCategory.schema.parse(input.url.split('/')[3].split('?')[0]);
  return trpcVanilla.getLeaderboard.query({ field, params: input.queryParams });
});

export const machine = createMachine({
  initial: 'setup',
  types: {
    context: {} as Context,
    events: {} as Event,
    input: {} as Input,
  },
  context: ({ input }) => ({
    data: { hasNext: false, results: [], page: 0, tokens: [], total: 0 },
    preloaded: input.preloaded,
    push: input.push,
    queryParams: urlToParsedParams(input.url, qpSchema),
    url: input.url,
  }),
  states: {
    setup: {
      always: [
        {
          // no query string, use preloaded data
          guard: ({ context }) => urlToQueryString(context.url).length === 0,
          actions: assign(({ context }) => ({
            url: context.preloaded.url,
            data: context.preloaded.data,
            queryParams: urlToParsedParams(context.preloaded.url, qpSchema),
          })),
          target: 'idle',
        },
        {
          // when a using a shared link with page > 0, all the data won't be there due to inifinite scroll, so just reset page
          guard: ({ context }) => context.queryParams.page > 0 && !context.data.results.length,
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
        CLEAR_BY_TOKEN_TYPE: {
          actions: ({ context, event }) => {
            const { name } = event;
            updateUrl(context, { [name]: [] });
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
            const { name, value } = event;
            const current = context.queryParams[name];
            const updated = current.filter(v => v !== value);
            updateUrl(context, { [name]: updated });
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
        src: 'fetchData',
        input: ({ context }) => context,
        onDone: {
          target: 'idle',
          actions: assign(({ context, event }) => {
            const data = { ...event.output };
            if (data.page > 0) data.results = [...context.data.results, ...data.results];
            return { data };
          }),
        },
        onError: {
          target: 'idle',
          actions: ({ event }) => {
            console.error('Error fetching', event);
          },
        },
      },
    },
  },
});

// abstracting machine context structure for easy component consumption
export const machineData = <T extends Variant>(state: StateFrom<typeof machine>) => {
  const { data, queryParams } = state.context;
  return {
    asc: queryParams.asc,
    hasTokens: data.tokens.length > 0,
    movieMode: queryParams.movieMode,
    results: data.results as FetchResponse<T>,
    oscarsCategoriesNom: queryParams.oscarsCategoriesNom,
    oscarsCategoriesWon: queryParams.oscarsCategoriesWon,
    searchMode: queryParams.searchMode,
    showVizSensor: state.matches('idle') && data.hasNext && data.results.length > 0,
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
export const machineActions = (send: (event: Event) => void) => ({
  clearTokens: () => {
    send({ type: 'CLEAR_ALL_TOKENS' });
  },
  clearTokenType: (tokenType: TokenType) => {
    send({ type: 'CLEAR_BY_TOKEN_TYPE', name: tokenType });
  },
  nextPage: () => {
    send({ type: 'GET_NEXT_PAGE' });
  },
  onUrlUpdate: (url: string) => {
    send({ type: 'URL_HAS_CHANGED', url });
  },
  removeToken: (token: Omit<Token, 'name'>) => {
    send({ type: 'REMOVE_TOKEN', name: token.type, value: token.id });
  },
  replaceToken: (token: Omit<Token, 'name'>) => {
    send({ type: 'REPLACE_TOKEN', name: token.type, value: token.id });
  },
  sort: (field: AppEnums['sort']) => {
    send({ type: 'SORT', field });
  },
  toggleSearchMode: () => {
    send({ type: 'TOGGLE_SEARCH_MODE' });
  },
  toggleSortOrder: () => {
    send({ type: 'TOGGLE_SORT_ORDER' });
  },
  toggleToken: (token: Omit<Token, 'name'>) => {
    // doesn't make sense to have two different movie id tokens
    if (token.type === 'movie') {
      send({ type: 'REPLACE_TOKEN', name: token.type, value: token.id });
    } else {
      send({ type: 'TOGGLE_TOKEN', name: token.type, value: token.id });
    }
  },
});

export const useQueryParamsMachine = <TVariant extends 'movies' | 'leaderboard'>({
  id,
  preloaded,
  variant,
}: {
  id: string;
  preloaded: Context['preloaded'];
  variant: TVariant;
}) => {
  const router = useRouter();

  const machineInstance = useMemo(() => {
    const fetchData = variant === 'movies' ? fetchMovies : fetchLeaderboard;
    return machine.provide({ actors: { fetchData } });
  }, [variant]);

  const [state, send] = useMachine(machineInstance, {
    id,
    input: {
      preloaded,
      url: router.asPath,
      push: url => router.replace(url, undefined, { shallow: true, scroll: false }),
    },
  });

  const data = useMemo(() => machineData<TVariant>(state), [state]);
  const actions = useMemo(() => machineActions(send), [send]);

  useUrlChange(actions.onUrlUpdate);

  return { data, actions };
};
