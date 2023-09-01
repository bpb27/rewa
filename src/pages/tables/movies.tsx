import { Icon } from '~/components/icons';
import Layout from '~/components/layout';
import { useEffect, useMemo, useRef, useState } from 'react';
import { smartSort } from '~/utils/sorting';
import { StaticProps } from '~/types';
import { FullTypeahead } from '~/components/full-typeahead';
import { MovieCards } from '~/components/movie-card';
import { useVizSensor } from '~/utils/use-viz-sensor';
import { sortingUtils, type SortProp } from '~/utils/sorting';
import { tokenUtils, Token, TokenMode } from '~/utils/token';
import { MovieTable } from '~/components/movie-table';
import { Button } from '~/components/ui/button';
import { Select } from '~/components/ui/select';
import { getMoviesForTable } from '~/data/movie-table';

export const getStaticProps = async () => {
  const movies = await getMoviesForTable();
  return {
    props: { movies },
  };
};

type MoviesProps = StaticProps<typeof getStaticProps>;
export type Movie = MoviesProps['movies'][number];

export default function Movies({ movies }: MoviesProps) {
  const [asc, setAsc] = useState(false);
  const [rowNumber, setRowNumber] = useState(20);
  const [tokenMode, setTokenMode] = useState<TokenMode>('or');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [orderBy, setOrderBy] = useState<SortProp>('episodeNumber');
  const [displayType, setDisplayType] = useState<'table' | 'card'>('table');
  const [loaded, setLoaded] = useState(false);
  const vizSensorRef = useRef<HTMLDivElement>(null);

  const movieList = useMemo(() => {
    const groupedTokens = tokenUtils.groupByType(tokens);
    const filtered = movies.filter(movie => tokenUtils.filter(groupedTokens, movie, tokenMode));
    const sorted = smartSort([...filtered], sortingUtils.fns[orderBy], asc);
    return sorted;
  }, [asc, movies, orderBy, tokens, tokenMode]);

  useVizSensor(vizSensorRef, {
    rootMargin: '200px',
    threshold: 0.1,
    callback: () => {
      setRowNumber(rowNumber + 20);
    },
  });

  // no window when SSR'd so need useEffect to render card view on mobile
  useEffect(() => {
    if (window.innerWidth < 700) setDisplayType('card');
    setLoaded(true);
  }, []);

  // reset displayed rows on search or filter
  useEffect(() => {
    setRowNumber(20);
  }, [movieList.length]);

  const toggleToken = (newToken: Token) => {
    setTokens(tokenUtils.toggle(tokens, newToken));
  };

  const displayedMovies = movieList.slice(0, rowNumber);
  return (
    <Layout title="All movies">
      <div className="mb-1 mt-3 flex flex-col py-2">
        <FullTypeahead onSelect={item => toggleToken(item)} />
        <div className="mt-1 flex space-x-2 overflow-scroll">
          {tokens.length > 0 && (
            <Button onClick={() => setTokens([])} variant="token">
              <Icon.Close className="mr-2" />
              Clear ({tokens.length})
            </Button>
          )}
          {tokens.length > 1 && (
            <Button
              className="flex"
              variant="token"
              onClick={() => setTokenMode(tokenMode === 'and' ? 'or' : 'and')}
            >
              <Icon.Filter className="mr-2" />
              {tokenMode === 'and' ? 'And' : 'Or'}
            </Button>
          )}
          {tokens.map(token => (
            <Button
              key={`${token.id}-${token.type}`}
              onClick={() => toggleToken(token)}
              variant="token"
            >
              {token.name}
            </Button>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-center">
          <h2 className="mr-3 flex items-center text-xl font-semibold tracking-wide">
            {movieList.length} <Icon.Movie className="ml-1" />
          </h2>
          <Select
            onSelect={value => setOrderBy(value as SortProp)}
            options={sortingUtils.options}
            value={orderBy}
          />
          <Button className="ml-1 mr-3" onClick={() => setAsc(!asc)} variant="icon">
            {asc ? <Icon.ArrowUp /> : <Icon.ArrowDown />}
          </Button>
          <Button
            className="ml-3"
            onClick={() => setDisplayType('table')}
            selected={displayType === 'table'}
            variant="icon"
          >
            <Icon.Table />
          </Button>
          <Button
            onClick={() => setDisplayType('card')}
            selected={displayType === 'card'}
            variant="icon"
          >
            <Icon.Card />
          </Button>
        </div>
      </div>
      {loaded ? (
        <>
          {displayType === 'table' ? (
            <MovieTable
              movies={displayedMovies}
              onSortClick={field => {
                if (orderBy === field) setAsc(!asc);
                else setOrderBy(field);
              }}
              onTokenClick={toggleToken}
            />
          ) : (
            <MovieCards movies={displayedMovies} onTokenClick={toggleToken} />
          )}
          <div ref={vizSensorRef} />
        </>
      ) : null}
    </Layout>
  );
}
