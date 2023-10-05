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

export type Movie = ApiGetMoviesResponse['movies'][number];
type MoviesPageProps = { initialData: ApiGetMoviesResponse; defaultQps: QpSchema };

// NB: initialData is the api call result w/ the default qps
// using w/ getStaticProps in pages so there's immediately data when you first hit the page
// but ignore it if there are QPs (!isEmpty)

export const MoviesPage = ({ defaultQps, initialData }: MoviesPageProps) => {
  const { values, update, updateAll, clearTokens, isEmpty } = useQueryParams(defaultQps);

  const vizSensorRef = useRef<HTMLDivElement>(null);

  const oscarsModal = useToggle('closed', 'open');
  const display = useToggle('table', 'card', null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [total, setTotal] = useState(isEmpty ? initialData.total : 0);
  const [movies, setMovies] = useState<ApiGetMoviesResponse['movies']>(
    isEmpty ? initialData.movies : []
  );

  const { data, isLoading } = useAPI('/api/movies', values, { skip: isEmpty });
  const { asc, mode, sort } = values;

  // no query param values, so update the URL with the defaults
  useEffect(() => {
    if (isEmpty) updateAll(values);
  }, [isEmpty]);

  // storing results to allow for infinite scroll
  // fresh means the list was reset (e.g. new token or sort)
  // otherwise it's another paginated batch that should be appended to existing list
  useEffect(() => {
    if (data && data.page) {
      setMovies([...movies, ...data.movies]);
      setTokens(data.tokens);
      setTotal(data.total);
    } else if (data) {
      setMovies(data.movies);
      setTokens(data.tokens);
      setTotal(data.total);
    }
  }, [data]);

  // default to card view on mobile (window doesn't exist when SSR'd so needs to be in effect)
  useEffect(() => {
    display.set(window.innerWidth < 700 ? 'card' : 'table');
  }, []);

  // enable infinite scroll
  useVizSensor(vizSensorRef, {
    rootMargin: '300px',
    threshold: 0.1,
    callback: () => {
      if (data?.hasNext) {
        update('page', data.page + 1);
      }
    },
  });

  const handleSort = (field: SortKey) =>
    field === sort ? update('asc', !asc) : update('sort', field);

  const handleTokenClick = (token: Token) => update(token.type, token.id);

  return (
    <Layout title="All movies">
      <Box.Filters>
        <FullTypeahead
          filter={values.hasEpisode ? 'episode' : 'oscar'}
          onSelect={token => update(token.type, token.id)}
        />
        <Box.Tokens>
          <TokenBar clear={clearTokens} update={update} tokens={tokens} mode={mode} />
        </Box.Tokens>
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
  Tokens: ({ children }) => <div className="mt-1 flex space-x-2 overflow-scroll">{children}</div>,
} satisfies Boxes;
