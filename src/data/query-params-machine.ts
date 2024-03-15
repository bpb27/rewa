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
  assembleUrl,
  qpSchema,
  urlToParsedParams,
  urlToQueryString,
} from './query-params';
import { type Token } from './tokens';

type Results = {
  page: number;
  total: number;
  hasNext: boolean;
  results: unknown[]; // use variant generic via hook to type
  tokens: Token[];
};

type Context = {
  data: Results;
  fetchParams: object;
  preloaded: { data: Results; url: string };
  push: (url: string) => void;
  queryParams: QpParsed;
  url: string;
};

type Event =
  | { type: 'CLEAR_ALL_TOKENS' }
  | { type: 'CLEAR_BY_TOKEN_TYPE'; tokenType: AppEnums['token'] }
  | { type: 'GET_NEXT_PAGE' }
  | { type: 'SORT'; field: AppEnums['sort'] }
  | { type: 'TOGGLE_SEARCH_MODE' }
  | { type: 'TOGGLE_SORT_ORDER' }
  | { type: 'TOGGLE_TOKEN'; tokenType: AppEnums['token']; tokenId: number }
  | { type: 'REPLACE_TOKEN'; tokenType: AppEnums['token']; tokenId: number }
  | { type: 'REMOVE_TOKEN'; tokenType: AppEnums['token']; tokenId: number }
  | { type: 'UPDATE_FETCH_PARAMS'; params: object }
  | { type: 'URL_HAS_CHANGED'; url: string };

type Input = Pick<Context, 'push' | 'url' | 'preloaded' | 'fetchParams'>;

type Variant = 'movies' | 'leaderboard';

type FetchResponse<T extends Variant> = T extends 'movies'
  ? ApiResponses['getMovies']['results']
  : T extends 'leaderboard'
  ? ApiResponses['getLeaderboard']['results']
  : never;

type FetchParams<T extends Variant> = T extends 'leaderboard'
  ? { field: AppEnums['topCategory']; subField: AppEnums['topCategorySub'] }
  : never;

// when this changes, the useUrlChange hook in useQueryParamsMachine will
// send the machine a URL_HAS_CHANGED event
const updateUrl = (context: Context, newQueryParams: Partial<QpSchema>) => {
  const newUrl = assembleUrl(context.url, {
    ...context.queryParams,
    ...newQueryParams,
    page: newQueryParams.page === undefined ? 0 : newQueryParams.page,
  });
  context.push(newUrl);
};

const fetchMovies = fromPromise<Results, Context>(async ({ input }) => {
  return trpcVanilla.getMovies.query({ ...input.queryParams, ...input.fetchParams });
});

const fetchLeaderboard = fromPromise<Results, Context>(async ({ input }) => {
  const additional = input.fetchParams as FetchParams<'leaderboard'>;
  return trpcVanilla.getLeaderboard.query({ params: input.queryParams, ...additional });
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
    fetchParams: input.fetchParams,
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
          target: 'fetching', // going to fetching to wake up lambdas - should be the same data as preloaded though
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
            const cleared = appEnums.token.values.reduce((acc, key) => ({ ...acc, [key]: [] }), {});
            updateUrl(context, cleared);
          },
        },
        CLEAR_BY_TOKEN_TYPE: {
          actions: ({ context, event }) => {
            updateUrl(context, { [event.tokenType]: [] });
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
            updateUrl(context, { [event.tokenType]: [event.tokenId] });
          },
        },
        REMOVE_TOKEN: {
          actions: ({ context, event }) => {
            const current = context.queryParams[event.tokenType];
            const updated = current.filter(id => id !== event.tokenId);
            updateUrl(context, { [event.tokenType]: updated });
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
            const current = context.queryParams[event.tokenType];
            const updated = current.includes(event.tokenId)
              ? current.filter(id => id !== event.tokenId)
              : [...current, event.tokenId];
            updateUrl(context, { [event.tokenType]: updated.sort() });
          },
        },
        UPDATE_FETCH_PARAMS: {
          target: 'fetching',
          actions: assign(({ event }) => ({
            fetchParams: event.params,
          })),
        },
      },
    },
    fetching: {
      on: {
        // cancel fetch, switch to idle state, forward event to idle event handlers
        // e.g. if fetching and a token changes, cancel the prior fetch and start a new one
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
    isFetching: state.matches('fetching'),
    fetchParams: state.context.fetchParams as FetchParams<T>,
    hasTokens: data.tokens.length > 0,
    movieMode: queryParams.movieMode,
    results: data.results as FetchResponse<T>,
    allQueryParams: queryParams,
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
export const machineActions = <T extends Variant>(send: (event: Event) => void) => ({
  clearTokens: () => {
    send({ type: 'CLEAR_ALL_TOKENS' });
  },
  clearTokenType: (tokenType: AppEnums['token']) => {
    send({ type: 'CLEAR_BY_TOKEN_TYPE', tokenType });
  },
  nextPage: () => {
    send({ type: 'GET_NEXT_PAGE' });
  },
  onUrlUpdate: (url: string) => {
    send({ type: 'URL_HAS_CHANGED', url });
  },
  removeToken: (tokenType: AppEnums['token'], tokenId: number) => {
    send({ type: 'REMOVE_TOKEN', tokenType, tokenId });
  },
  replaceToken: (tokenType: AppEnums['token'], tokenId: number) => {
    send({ type: 'REPLACE_TOKEN', tokenType, tokenId });
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
  toggleToken: (tokenType: AppEnums['token'], tokenId: number) => {
    send({ type: 'TOGGLE_TOKEN', tokenType, tokenId });
  },
  updateFetchParams: (params: FetchParams<T>) => {
    send({ type: 'UPDATE_FETCH_PARAMS', params });
  },
});

export const useQueryParamsMachine = <T extends Variant>({
  fetchParams,
  preloaded,
  variant,
}: {
  fetchParams?: FetchParams<T>;
  preloaded: Context['preloaded'];
  variant: T;
}) => {
  const router = useRouter();

  const machineInstance = useMemo(() => {
    const fetchData = variant === 'movies' ? fetchMovies : fetchLeaderboard;
    return machine.provide({ actors: { fetchData } });
  }, [variant]);

  const [state, send] = useMachine(machineInstance, {
    inspect: inspectionEvent => {
      if (inspectionEvent.type === '@xstate.event') {
        console.log(inspectionEvent.event);
      }
    },
    id: fetchParams?.field || variant,
    input: {
      fetchParams: fetchParams || {},
      preloaded,
      url: router.asPath,
      push: url => router.replace(url, undefined, { shallow: true, scroll: false }),
    },
  });

  const data = useMemo(() => machineData<T>(state), [state]);
  const actions = useMemo(() => machineActions<T>(send), [send]);

  useUrlChange(actions.onUrlUpdate);

  return { data, actions };
};
