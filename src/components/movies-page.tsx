import { useState } from 'react';
import Layout from '~/components/layout';
import { MoviesTable } from '~/components/movies-table';
import { SearchBar } from '~/components/search-bar';
import { TokenBar } from '~/components/token-bar';
import { Crate } from '~/components/ui/box';
import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icons';
import { Select } from '~/components/ui/select';
import { Text } from '~/components/ui/text';
import { useQueryParamsMachine } from '~/data/query-params-machine';
import { ApiResponses } from '~/trpc/router';
import { isSameObject } from '~/utils/object';
import { oscarSortOptions, sortOptions } from '~/utils/sorting';
import { cn } from '~/utils/style';
import { useVizSensor } from '~/utils/use-viz-sensor';
import { MovieCardSidebar } from './overlays/movie-card-sidebar';
import { MovieCastSidebar } from './overlays/movie-cast-modal';
import { MovieCrewSidebar } from './overlays/movie-crew-sidebar';
import { MovieFiltersDialog } from './overlays/movie-filters-dialog';
import { OscarYearModal } from './overlays/oscar-year-modal';

export type MoviesPageMovie = ApiResponses['getMovies']['results'][number];

type MoviesPageProps = {
  preloaded: { url: string; data: ApiResponses['getMovies'] };
};

type PageSider =
  | { variant: 'movieDescription'; movieId: number }
  | { variant: 'movieCast'; movieId: number }
  | { variant: 'movieCrew'; movieId: number }
  | { variant: 'oscarYear'; movieId: number; year: number }
  | { variant: 'closed' };

export const MoviesPage = ({ preloaded }: MoviesPageProps) => {
  const { data, actions } = useQueryParamsMachine({ preloaded, variant: 'movies' });
  const loadMoreRef = useVizSensor({ callback: actions.nextPage });
  const [sidebar, setSidebar] = useState<PageSider>({ variant: 'closed' });
  const closeSidebar = () => setSidebar({ variant: 'closed' });
  const openSidebar = (params: PageSider): void =>
    isSameObject(params, sidebar) ? closeSidebar() : setSidebar(params);

  return (
    <Layout title="All movies">
      <Crate column p={2} mb={1} gap={3}>
        <SearchBar filter={data.movieMode} onSelect={actions.toggleToken} />
        <Crate gap={2} overflowScroll hide={!data.hasTokens}>
          <TokenBar {...data} {...actions} />
        </Crate>
        <Crate alignCenter justifyCenter gap={3}>
          <Text
            bold
            icon="Movie"
            iconOrientation="right"
            size="lg"
            className={cn(data.isFetching && 'animate-pulse')}
          >
            {data.total}
          </Text>
          <Crate alignCenter gap={1}>
            <Select
              onSelect={actions.sort}
              options={data.movieMode === 'oscar' ? oscarSortOptions : sortOptions}
              value={data.sort}
            />
            <Button onClick={actions.toggleSortOrder} variant="icon">
              {data.asc ? <Icon.ArrowUp /> : <Icon.ArrowDown />}
            </Button>
          </Crate>
          <MovieFiltersDialog {...data} {...actions} />
        </Crate>
      </Crate>
      <MoviesTable
        mode={data.movieMode}
        movies={data.results}
        onShowCastClick={movieId => openSidebar({ variant: 'movieCast', movieId })}
        onShowCrewClick={movieId => openSidebar({ variant: 'movieCrew', movieId })}
        onTokenClick={actions.toggleToken}
        onSortClick={actions.sort}
        onOscarYearClick={params => openSidebar({ variant: 'oscarYear', ...params })}
        onMovieTitleClick={movieId => openSidebar({ variant: 'movieDescription', movieId })}
      />
      {data.showVizSensor && <div ref={loadMoreRef} />}
      {sidebar?.variant === 'oscarYear' && (
        <OscarYearModal movieId={sidebar.movieId} onClose={closeSidebar} year={sidebar.year} />
      )}
      {sidebar?.variant === 'movieDescription' && (
        <MovieCardSidebar movieId={sidebar.movieId} onClose={closeSidebar} />
      )}
      {sidebar.variant === 'movieCast' && (
        <MovieCastSidebar
          movieId={sidebar.movieId}
          onTokenClick={actions.toggleToken}
          onClose={closeSidebar}
        />
      )}
      {sidebar.variant === 'movieCrew' && (
        <MovieCrewSidebar
          movieId={sidebar.movieId}
          onTokenClick={actions.toggleToken}
          onClose={closeSidebar}
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
