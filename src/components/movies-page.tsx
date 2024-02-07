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
import { oscarSortOptions, sortOptions } from '~/utils/sorting';
import { useVizSensor } from '~/utils/use-viz-sensor';
import { MovieFiltersDialog } from './overlays/movie-filters-dialog';
import { OscarYearModal } from './overlays/oscar-year-modal';
import { Modal } from './ui/modal';
import { Spotlight } from './ui/spotlight';

export type MoviesPageMovie = ApiResponses['getMovies']['results'][number];

type MoviesPageProps = {
  preloaded: { url: string; data: ApiResponses['getMovies'] };
};

export const MoviesPage = ({ preloaded }: MoviesPageProps) => {
  const { data, actions } = useQueryParamsMachine({ id: 'movies', preloaded, variant: 'movies' });
  const [oscarsModal, setOscarsModal] = useState<{ year: number; movieId: number } | undefined>();
  const [movieModal, setMovieModal] = useState<MoviesPageMovie | undefined>();
  const loadMoreRef = useVizSensor({ callback: actions.nextPage });

  return (
    <Layout title="All movies">
      <Crate column p={2} mb={1} gap={3}>
        <SearchBar filter={data.movieMode} onSelect={actions.toggleToken} />
        <Crate gap={2} overflowScroll hide={!data.hasTokens}>
          <TokenBar {...data} {...actions} />
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
        movies={data.results}
        onTokenClick={actions.toggleToken}
        onSortClick={actions.sort}
        onOscarYearClick={setOscarsModal}
        onMovieTitleClick={id => setMovieModal(data.results.find(m => m.id === id))}
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
        <Modal isOpen={!!movieModal} onClose={() => setMovieModal(undefined)}>
          <Spotlight
            description={movieModal.overview}
            image={movieModal.poster_path}
            name={movieModal.title}
            tagline={movieModal.tagline}
          />
        </Modal>
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
