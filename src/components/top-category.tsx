import { useState } from 'react';
import { MoviePoster, PersonPoster } from '~/components/images';
import Layout from '~/components/layout';
import { MovieCardSidebar } from '~/components/overlays/movie-card-sidebar';
import { PersonCardSidebar } from '~/components/overlays/person-card-sidebar';
import { Crate, type Boxes } from '~/components/ui/box';
import { useQueryParamsMachine } from '~/data/query-params-machine';
import { ApiResponses } from '~/trpc/router';
import { AppEnums } from '~/utils/enums';
import { getYear } from '~/utils/format';
import { isSameObject } from '~/utils/object';
import { rankByTotalMovies } from '~/utils/ranking';
import { cn } from '~/utils/style';
import { SearchBar } from './search-bar';
import { TokenBar } from './token-bar';
import { Radio } from './ui/radio';
import { Text } from './ui/text';

type TopCategoryProps = {
  field: AppEnums['topCategory'];
  subField: AppEnums['topCategorySub'];
  movieMode: AppEnums['movieMode'];
  hideProfileImage?: boolean;
  preloaded: { data: ApiResponses['getLeaderboard']; url: string };
};

type Selected = { movieId: number } | { personId: number } | { movieId: number; actorId: number };

export const TopCategory = ({
  field,
  subField,
  hideProfileImage,
  movieMode,
  preloaded,
}: TopCategoryProps) => {
  const [selected, select] = useState<Selected | undefined>(undefined);

  const { data, actions } = useQueryParamsMachine({
    fetchParams: { field, subField },
    preloaded,
    variant: 'leaderboard',
  });

  const handleSelect = (selection: Selected) => {
    select(isSameObject(selection, selected || {}) ? undefined : selection);
  };

  return (
    <Layout title={titles[field]}>
      <Crate column mb={2} gap={3}>
        <Crate justifyCenter>
          <Text size="xl" bold>
            {titles[field]}
          </Text>
        </Crate>
        <SearchBar filter={data.movieMode} onSelect={actions.toggleToken} />
        <Crate gap={2} overflowScroll hide={!data.hasTokens}>
          <TokenBar {...data} {...actions} />
        </Crate>
        {movieMode === 'oscar' && (
          <Crate justifyCenter>
            <Radio id="mode" label="Mode">
              <Crate gap={3}>
                <Radio.Item
                  checked={data.fetchParams.subField === 'mostNoms'}
                  disabled={field === 'producer'}
                  label="Most nominations"
                  onClick={subField => actions.updateFetchParams({ field, subField })}
                  value="mostNoms"
                />
                <Radio.Item
                  checked={data.fetchParams.subField === 'mostWins'}
                  disabled={field === 'producer'}
                  label="Most wins"
                  onClick={subField => actions.updateFetchParams({ field, subField })}
                  value="mostWins"
                />
                <Radio.Item
                  checked={data.fetchParams.subField === 'mostFilms'}
                  label="Most films"
                  onClick={subField => actions.updateFetchParams({ field, subField })}
                  value="mostFilms"
                />
              </Crate>
            </Radio>
          </Crate>
        )}
      </Crate>
      {rankByTotalMovies(
        data.results,
        // TODO: order by credit order or name if there's a tie
        (a, b) =>
          Number(getYear(b.movies[a.movies.length - 1].releaseDate)) -
          Number(getYear(a.movies[a.movies.length - 1].releaseDate))
      ).map(person => (
        <Box.Person key={person.id}>
          {!hideProfileImage && (
            <Box.ProfilePic>
              <PersonPoster name={person.name} poster_path={person.image} variant="leaderboard" />
            </Box.ProfilePic>
          )}
          <Crate gap={3} column>
            <Text
              size="lg"
              className="ml-1 mt-2"
              onClick={() => handleSelect({ personId: person.id })}
              flex={false}
              tag="span"
            >
              #{person.rank} {person.name} with {person.movies.length} movies{' '}
              {person.ties > 1 && (
                <Text flex={false} className="text-slate-400">
                  ({person.ties} tied)
                </Text>
              )}
            </Text>
            <Box.MovieBar>
              {person.movies.map(m => (
                <Box.MoviePoster key={m.id}>
                  <MoviePoster
                    className="cursor-pointer hover:scale-110 hover:drop-shadow-xl"
                    poster_path={m.image}
                    variant="leaderboard"
                    title={m.title}
                    onClick={() =>
                      handleSelect(
                        field === 'actor'
                          ? { actorId: person.id, movieId: m.id }
                          : { movieId: m.id }
                      )
                    }
                  />
                </Box.MoviePoster>
              ))}
            </Box.MovieBar>
          </Crate>
        </Box.Person>
      ))}
      {selected && 'movieId' in selected && (
        <MovieCardSidebar
          movieId={selected.movieId}
          actorId={'actorId' in selected ? selected.actorId : undefined}
          onClose={() => select(undefined)}
        />
      )}
      {selected && 'personId' in selected && (
        <PersonCardSidebar
          personId={selected.personId}
          field={field}
          subField={data.fetchParams.subField}
          queryParams={data.allQueryParams}
          onClose={() => select(undefined)}
          onSelectMovie={movieId => handleSelect({ actorId: selected.personId, movieId })}
        />
      )}
    </Layout>
  );
};

const Box = {
  Person: ({ children }) => (
    <div
      className={cn(
        'mb-3 flex flex-row items-center gap-x-3',
        'border-2 border-slate-300 bg-slate-100 shadow-md'
      )}
    >
      {children}
    </div>
  ),
  ProfilePic: ({ children }) => <div className="hidden shrink-0 sm:block">{children}</div>,
  MovieBar: ({ children }) => (
    <div className="hide-scrollbar flex space-x-2 overflow-y-hidden overflow-x-scroll">
      {children}
    </div>
  ),
  MoviePoster: ({ children }) => <div className="shrink-0">{children}</div>,
} satisfies Boxes;

const titles = {
  actor: 'Top Actors',
  cinematographer: 'Top Cinematographers',
  director: 'Top Directors',
  producer: 'Top Producers',
  writer: 'Top Writers',
};
