import { useState } from 'react';
import Layout from '~/components/layout';
import { MovieCards } from '~/components/movie-card';
import { MovieTable } from '~/components/movie-table';
import { SearchBar } from '~/components/search-bar';
import { TokenBar } from '~/components/token-bar';
import { type Boxes } from '~/components/ui/box';
import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icons';
import { Select } from '~/components/ui/select';
import { QpSchema } from '~/data/query-params';
import { useMoviePageData } from '~/data/use-movies-page-data';
import { type ApiGetMoviesResponse } from '~/pages/api/movies';
import { sortOptions } from '~/utils/sorting';
import { useScreenSizeOnMount } from '~/utils/use-screen-size-on-mount';
import { useToggle } from '~/utils/use-toggle';
import { MovieFiltersDialog } from './movie-filters-dialog';
import { OscarYearModal } from './oscar-year-modal';

export type MoviesPageMovie = ApiGetMoviesResponse['movies'][number];

type MoviesPageProps = {
  defaultQps: QpSchema;
  initialData: ApiGetMoviesResponse;
};

export const MoviesPage = ({ defaultQps, initialData }: MoviesPageProps) => {
  const { actions, conditions, data } = useMoviePageData({ defaultQps, initialData });
  const display = useToggle('table', 'card', null);
  const oscarsModal = useToggle('closed', 'open');
  const [oscarsModalYear, setOscarsModalYear] = useState(2022);

  useScreenSizeOnMount({
    onDesktop: display.setTable,
    onMobile: display.setCard,
  });

  return (
    <Layout title="All movies">
      <Box.Filters>
        <SearchBar filter={data.mode} onSelect={actions.toggleToken} />
        {conditions.hasTokens && (
          <Box.Tokens>
            <TokenBar
              clear={actions.clearTokens}
              mode={data.searchMode}
              toggleSearchMode={actions.toggleSearchMode}
              toggleToken={actions.toggleToken}
              tokens={data.tokens}
            />
          </Box.Tokens>
        )}
        <Box.FilterButtons>
          <span className="flex items-stretch">
            <h2 className="text-xl font-semibold tracking-wide">{data.total}</h2>
            <Icon.Movie className="ml-1" />
          </span>
          <span className="flex items-center">
            <Select onSelect={actions.sort} options={sortOptions} value={data.sort} />
            <Button className="ml-1" onClick={actions.toggleSortOrder} variant="icon">
              {conditions.asc ? <Icon.ArrowUp /> : <Icon.ArrowDown />}
            </Button>
          </span>
          <span className="hidden md:flex">
            <Button onClick={display.setTable} selected={display.isTable} variant="icon">
              <Icon.Table />
            </Button>
            <Button onClick={display.setCard} selected={display.isCard} variant="icon">
              <Icon.Card />
            </Button>
          </span>
          <span className="flex md:hidden">
            <Button onClick={display.toggle} variant="icon">
              {display.isTable ? <Icon.Table /> : <Icon.Card />}
            </Button>
          </span>
          <span className="flex">
            <MovieFiltersDialog />
          </span>
        </Box.FilterButtons>
      </Box.Filters>
      {display.isTable && (
        <MovieTable
          mode={data.mode}
          movies={data.movies}
          onTokenClick={actions.toggleToken}
          onSortClick={actions.sort}
          onOscarYearClick={(year: number) => {
            setOscarsModalYear(year);
            oscarsModal.setOpen();
          }}
        />
      )}
      {display.isCard && <MovieCards movies={data.movies} onTokenClick={actions.toggleToken} />}
      {display.isDefined && conditions.showVizSensor && <div ref={data.vizSensorRef} />}
      {oscarsModal.isOpen && (
        <OscarYearModal
          isOpen={oscarsModal.isOpen}
          onClose={oscarsModal.setClosed}
          year={oscarsModalYear}
        />
      )}
      <Button
        variant="icon"
        onClick={() => window?.scrollTo(0, 0)}
        className="fixed bottom-1 right-1 bg-slate-800 text-white opacity-50"
      >
        <Icon.ArrowUp />
      </Button>
    </Layout>
  );
};

const Box = {
  Filters: ({ children }) => <div className="mb-1 mt-3 flex flex-col py-2">{children}</div>,
  FilterButtons: ({ children }) => (
    <div className="mt-3 flex items-center justify-center gap-x-3">{children}</div>
  ),
  Tokens: ({ children }) => <div className="mt-2 flex space-x-2 overflow-scroll">{children}</div>,
} satisfies Boxes;
