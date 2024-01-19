import { useCallback, useMemo, useState } from 'react';
import { MoviePoster, PersonPoster } from '~/components/images';
import Layout from '~/components/layout';
import { ActorCardSidebar } from '~/components/overlays/actor-card-sidebar';
import { MovieCardSidebar } from '~/components/overlays/movie-card-sidebar';
import { Crate, type Boxes } from '~/components/ui/box';
import { ApiResponses } from '~/trpc/router';
import { rankByTotalMovies } from '~/utils/ranking';
import { sortByDate } from '~/utils/sorting';
import { cn } from '~/utils/style';
import { Text } from './ui/text';

type TopCategoryProps = {
  category: 'actor' | 'director' | 'writer' | 'cinematographer' | 'producer';
  mode: 'rewa' | 'oscars';
  people: ApiResponses['getTopActors'] | ApiResponses['getTopCrew'];
};

const tabTitles = {
  actor: 'Top Actors',
  cinematographer: 'Top Cinematographers',
  director: 'Top Directors',
  producer: 'Top Producers',
  writer: 'Top Writers',
};

const pt = 'the most Oscar-nominated movies since 1950';
const pageTitles = {
  actor: `Acted in ${pt}`,
  cinematographer: `Filmed ${pt}`,
  director: `Directed ${pt}`,
  producer: `Produced ${pt}`,
  writer: `Wrote ${pt}`,
};

export const TopCategory = ({ category, mode, people }: TopCategoryProps) => {
  const isActor = useMemo(() => category === 'actor', [category]);
  const selectFirst = useCallback(() => {
    const movieId = people[0].movies[0].id;
    const personId = people[0].id;
    select(isActor ? { movieId, actorId: personId } : { movieId });
  }, [people, isActor]);

  const [selected, select] = useState<
    { movieId: number } | { actorId: number } | { movieId: number; actorId: number } | undefined
  >(undefined);

  // useScreenSizeOnMount({ onDesktop: selectFirst });

  return (
    <Layout title={tabTitles[category]}>
      {mode === 'oscars' && (
        <Crate mb={3} justifyCenter>
          <Text size="lg">{pageTitles[category]}</Text>
        </Crate>
      )}
      {selected && 'movieId' in selected && (
        <MovieCardSidebar {...selected} onClose={() => select(undefined)} />
      )}
      {selected && 'actorId' in selected && !('movieId' in selected) && (
        <ActorCardSidebar
          {...selected}
          onClose={() => select(undefined)}
          onSelectMovie={movieId => select({ actorId: selected.actorId, movieId })}
        />
      )}
      {rankByTotalMovies(people).map(person => (
        <Box.Person key={person.id}>
          <Box.ProfilePic>
            <PersonPoster
              name={person.name}
              poster_path={person.profile_path}
              variant="leaderboard"
            />
          </Box.ProfilePic>
          <Crate gap={2} column>
            <Text
              size="lg"
              onClick={isActor ? () => select({ actorId: person.id }) : undefined}
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
              {person.movies
                .sort((a, b) => sortByDate(a.release_date, b.release_date))
                .map(m => (
                  <MoviePoster
                    className="cursor-pointer hover:scale-110 hover:drop-shadow-xl"
                    key={m.id}
                    poster_path={m.poster_path}
                    variant="leaderboard"
                    title={m.title}
                    onClick={() =>
                      select(isActor ? { actorId: person.id, movieId: m.id } : { movieId: m.id })
                    }
                  />
                ))}
            </Box.MovieBar>
          </Crate>
        </Box.Person>
      ))}
    </Layout>
  );
};

const Box = {
  Person: ({ children }) => (
    <div
      className={cn(
        'mb-3 flex flex-row items-center gap-x-3 p-1',
        'border-2 border-slate-300 bg-slate-100 shadow-md'
      )}
    >
      {children}
    </div>
  ),
  ProfilePic: ({ children }) => <div className="hidden shrink-0 sm:block">{children}</div>,
  HeaderAndMovies: ({ children }) => <div>{children}</div>,
  MovieBar: ({ children }) => (
    <div className="hide-scrollbar flex space-x-2 overflow-y-hidden overflow-x-scroll">
      {children}
    </div>
  ),
} satisfies Boxes;
