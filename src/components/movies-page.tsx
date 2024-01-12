import { useMachine } from '@xstate/react';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import Layout from '~/components/layout';
import { MoviesTable } from '~/components/movies-table';
import { SearchBar } from '~/components/search-bar';
import { TokenBar } from '~/components/token-bar';
import { Crate } from '~/components/ui/box';
import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icons';
import { Select } from '~/components/ui/select';
import { Text } from '~/components/ui/text';
import { movieTableActions, movieTableData, movieTableMachine } from '~/data/movie-data-machine';
import { ApiResponses } from '~/trpc/router';
import { oscarSortOptions, sortOptions } from '~/utils/sorting';
import { useUrlChange } from '~/utils/use-url-change';
import { useVizSensor } from '~/utils/use-viz-sensor';
import { MovieFiltersDialog } from './overlays/movie-filters-dialog';
import { MovieSpotlightModal } from './overlays/movie-spotlight-modal';
import { OscarYearModal } from './overlays/oscar-year-modal';

export type MoviesPageMovie = ApiResponses['getMovies']['movies'][number];

type MoviesPageProps = {
  preloaded: { url: string; data: ApiResponses['getMovies'] };
};

export const MoviesPage = ({ preloaded }: MoviesPageProps) => {
  const router = useRouter();

  const [state, send] = useMachine(movieTableMachine, {
    input: {
      preloaded,
      url: router.asPath,
      push: url => router.replace(url, undefined, { shallow: true, scroll: false }),
    },
  });

  const data = useMemo(() => movieTableData(state), [state]);
  const actions = useMemo(() => movieTableActions(send), [send]);
  const [oscarsModal, setOscarsModal] = useState<{ year: number; movieId: number } | undefined>();
  const [movieModal, setMovieModal] = useState<number | undefined>();
  const loadMoreRef = useVizSensor({ callback: actions.nextPage });
  useUrlChange(actions.onUrlUpdate);

  return (
    <Layout title="All movies">
      <Crate column p={2} mb={1} gap={3}>
        <SearchBar filter={data.movieMode} onSelect={actions.toggleToken} />
        <Crate gap={2} overflowScroll hide={!data.hasTokens}>
          <TokenBar
            clear={actions.clearTokens}
            mode={data.searchMode}
            toggleSearchMode={actions.toggleSearchMode}
            toggleToken={actions.toggleToken}
            tokens={data.tokens}
          />
        </Crate>
        <Crate alignCenter justifyCenter gap={3}>
          <Text bold icon="Movie" iconOrientation="right" size="lg">
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
        movies={data.movies}
        onTokenClick={actions.toggleToken}
        onSortClick={actions.sort}
        onOscarYearClick={setOscarsModal}
        onMovieTitleClick={setMovieModal}
      />
      {data.showVizSensor && <div ref={loadMoreRef} />}
      {!!oscarsModal && (
        <OscarYearModal
          {...oscarsModal}
          isOpen={!!oscarsModal}
          onClose={() => setOscarsModal(undefined)}
        />
      )}
      {!!movieModal && (
        <MovieSpotlightModal
          {...data.movies.find(m => m.id === movieModal)!}
          isOpen={!!movieModal}
          onClose={() => setMovieModal(undefined)}
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
