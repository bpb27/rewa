import { useEffect, useRef, useState } from 'react';
import { QpSchema, useQueryParams, type SortKey } from '~/data/query-params';
import { Token } from '~/data/tokens';
import { type ApiGetMoviesResponse } from '~/pages/api/movies';
import { useAPI } from '~/utils/use-api';
import { useVizSensor } from '~/utils/use-viz-sensor';

/*

  initalData is the API response when the default query params are used
  it's fetched in a getStaticProps call in the pages directory
  
  if the URL has no query params, e.g. /rewa/movies
    1. show intitialData
    2. add the default query params to the URL
    3. skip the initial useAPI call (already have the data)
  
  why?
    1. no loading time on first page visit
    2. keep URL state as the source of truth

  if the URL does have query params, e.g. /rewa/movies?actor=1...
    1. ignore the intial data
    2. fetch data via useAPI

*/

type UseMoviePageDataProps = { initialData: ApiGetMoviesResponse; defaultQps: QpSchema };

export const useMoviePageData = ({ defaultQps, initialData }: UseMoviePageDataProps) => {
  const { values, update, updateAll, clearTokens, isEmpty } = useQueryParams(defaultQps);
  const { asc, hasEpisode, searchMode, sort } = values;
  const [{ hasNext, movies, page, tokens, total }, updateResponse] = useState<ApiGetMoviesResponse>(
    isEmpty ? initialData : { hasNext: false, movies: [], page: 0, tokens: [], total: 0 }
  );
  const { data, isLoading } = useAPI('/api/movies', values, { skip: isEmpty });
  const vizSensorRef = useRef<HTMLDivElement>(null);
  const showVizSensor = !!(!isLoading && data?.hasNext && movies.length);

  // add default params to URL (if missing)
  useEffect(() => {
    if (isEmpty) updateAll(values);
  }, [isEmpty]);

  // store latest API response (append movies if paginated)
  useEffect(() => {
    if (data) {
      const updatedMovies = data.page ? [...movies, ...data.movies] : data.movies;
      updateResponse({ ...data, movies: updatedMovies });
    }
  }, [data]);

  // load more via inifinite scroll
  useVizSensor(vizSensorRef, {
    rootMargin: '300px',
    threshold: 0.1,
    callback: () => {
      if (hasNext) update('page', page + 1);
    },
  });

  return {
    actions: {
      clearTokens,
      sort: (field: SortKey) => (field === sort ? update('asc', !asc) : update('sort', field)),
      toggleToken: (token: Token) => update(token.type, token.id),
      toggleSearchMode: () => update('searchMode', searchMode === 'and' ? 'or' : 'and'),
      toggleSortOrder: () => update('asc', !asc),
    },
    conditions: {
      asc,
      hasTokens: tokens.length > 0,
      showVizSensor,
    },
    data: {
      mode: hasEpisode ? ('episode' as const) : ('oscar' as const),
      searchMode,
      movies,
      tokens,
      vizSensorRef,
      sort,
      total,
    },
  };
};
