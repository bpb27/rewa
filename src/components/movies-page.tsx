import { useEffect, useRef, useState } from 'react';
import { FullTypeahead } from '~/components/full-typeahead';
import { MovieCards } from '~/components/movie-card';
import { Icon } from '~/components/ui/icons';
import Layout from '~/components/layout';
import { MovieTable } from '~/components/movie-table';
import { TokenBar } from '~/components/token-bar';
import { type Boxes } from '~/components/ui/box';
import { Button } from '~/components/ui/button';
import { Select } from '~/components/ui/select';
import { Space } from '~/components/ui/space';
import { type SortKey, useQueryParams, QpSchema } from '~/data/query-params';
import { Token } from '~/data/tokens';
import { type ApiGetMoviesResponse } from '~/pages/api/movies';
import { useAPI } from '~/utils/use-api';
import { sortOptions } from '~/utils/sorting';
import { useVizSensor } from '~/utils/use-viz-sensor';
import { OscarYearModal } from './oscar-year-modal';
import { useToggle } from '~/utils/use-toggle';
import { MovieFiltersDialog } from './movie-filters-dialog';

/*
  if the URL has no query params (e.g. /rewa/movies)
  - show initialData - the API response from /api/movies with the default params (prefetched via getStaticProps)
  - add the default params to the URL
  - why: no loading time for first page visit + keep state in URL
*/

export type Movie = ApiGetMoviesResponse['movies'][number];
type MoviesPageProps = { initialData: ApiGetMoviesResponse; defaultQps: QpSchema };

export const MoviesPage = ({ defaultQps, initialData }: MoviesPageProps) => {
  const { values, update, updateAll, clearTokens, isEmpty } = useQueryParams(defaultQps);
  const { asc, hasEpisode, searchMode, sort } = values;

  const { data, isLoading } = useAPI('/api/movies', values, { skip: isEmpty });

  const [{ hasNext, movies, page, tokens, total }, updateResponse] = useState<ApiGetMoviesResponse>(
    isEmpty ? initialData : { hasNext: false, movies: [], page: 0, tokens: [], total: 0 }
  );

  const vizSensorRef = useRef<HTMLDivElement>(null);
  const oscarsModal = useToggle('closed', 'open');
  const display = useToggle('table', 'card', null);

  // default to card view on mobile (window not available on SSR)
  useEffect(() => {
    window.innerWidth < 700 ? display.setCard() : display.setTable();
  }, []);

  // add default params to URL
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

  const handleSort = (field: SortKey) =>
    field === sort ? update('asc', !asc) : update('sort', field);

  const handleTokenClick = (token: Token) => update(token.type, token.id);

  return (
    <Layout title="All movies">
      <Box.Filters>
        <FullTypeahead
          filter={hasEpisode ? 'episode' : 'oscar'}
          onSelect={token => update(token.type, token.id)}
        />
        {!!tokens.length && (
          <Box.Tokens>
            <TokenBar clear={clearTokens} update={update} tokens={tokens} mode={searchMode} />
          </Box.Tokens>
        )}
        <Box.FilterButtons>
          <h2 className="text-xl font-semibold tracking-wide">{total}</h2>
          <Icon.Movie className="ml-1" />
          <Space w={3} />
          <Select onSelect={handleSort} options={sortOptions} value={sort} />
          <Button className="ml-1" onClick={() => update('asc', !asc)} variant="icon">
            {asc ? <Icon.ArrowUp /> : <Icon.ArrowDown />}
          </Button>
          <Space w={3} />
          <Button onClick={display.setTable} selected={display.isTable} variant="icon">
            <Icon.Table />
          </Button>
          <Button onClick={display.setCard} selected={display.isCard} variant="icon">
            <Icon.Card />
          </Button>
          <Space w={3} />
          <MovieFiltersDialog />
        </Box.FilterButtons>
      </Box.Filters>
      {display.isTable && (
        <MovieTable movies={movies} onTokenClick={handleTokenClick} onSortClick={handleSort} />
      )}
      {display.isCard && <MovieCards movies={movies} onTokenClick={handleTokenClick} />}
      {display.isDefined && !isLoading && !!data?.hasNext && !!movies.length && (
        <div ref={vizSensorRef} />
      )}
      {oscarsModal.isOpen && (
        <OscarYearModal isOpen={oscarsModal.isOpen} onClose={oscarsModal.setClosed} year={1987} />
      )}
    </Layout>
  );
};

const Box = {
  Filters: ({ children }) => <div className="mb-1 mt-3 flex flex-col py-2">{children}</div>,
  FilterButtons: ({ children }) => (
    <div className="mt-3 flex items-center justify-center">{children}</div>
  ),
  Tokens: ({ children }) => <div className="mt-2 flex space-x-2 overflow-scroll">{children}</div>,
} satisfies Boxes;
