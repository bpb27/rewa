import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';
import { moviePosterSize, tmdbImage } from '~/components/images';
import Layout from '~/components/layout';
import { ActorCardSidebar } from '~/components/overlays/actor-card-sidebar';
import { MovieCardSidebar } from '~/components/overlays/movie-card-sidebar';
import { Crate, type Boxes } from '~/components/ui/box';
import { ApiResponses } from '~/trpc/router';
import { rankByTotalMovies } from '~/utils/ranking';
import { sortByDate } from '~/utils/sorting';
import { useScreenSizeOnMount } from '~/utils/use-screen-size-on-mount';
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

  useScreenSizeOnMount({ onDesktop: selectFirst });

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
          {person.profile_path ? (
            <Box.ProfilePic>
              <Image
                className="h-full w-full object-cover"
                src={tmdbImage(person.profile_path)}
                alt={`Image of ${person.name}`}
                fill
              />
            </Box.ProfilePic>
          ) : (
            <Box.EmptyProfilePic />
          )}
          <Box.HeaderAndMovies>
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
                  <Image
                    {...moviePosterSize(80)}
                    key={m.id}
                    src={`https://image.tmdb.org/t/p/original${m.poster_path}`}
                    alt={`Movie poster for ${m.title}`}
                    className="m-1 scale-100 cursor-pointer border-2 border-black hover:scale-110 hover:drop-shadow-xl"
                    onClick={() =>
                      select(isActor ? { actorId: person.id, movieId: m.id } : { movieId: m.id })
                    }
                  />
                ))}
            </Box.MovieBar>
          </Box.HeaderAndMovies>
        </Box.Person>
      ))}
    </Layout>
  );
};

const Box = {
  Person: ({ children }) => (
    <div className="mb-8 flex flex-col items-start bg-slate-100 shadow-md sm:flex-row sm:items-center">
      {children}
    </div>
  ),
  ProfilePic: ({ children }) => (
    <div className="rounderd relative mb-4 hidden border-2  border-slate-700 shadow-xl sm:mb-0 sm:mr-4 sm:block sm:h-[200px] sm:w-[130px]">
      {children}
    </div>
  ),
  EmptyProfilePic: ({ children }) => (
    <div className="relative mb-4 hidden bg-gradient-to-r from-gray-200 to-gray-500 sm:mb-0 sm:mr-4 sm:block sm:h-[200px] sm:w-[130px]">
      {children}
    </div>
  ),
  HeaderAndMovies: ({ children }) => (
    <div className="flex w-full flex-col content-center">{children}</div>
  ),
  MovieBar: ({ children }) => (
    <div className="hide-scrollbar mt-2 flex space-x-2 overflow-y-hidden overflow-x-scroll">
      {children}
    </div>
  ),
} satisfies Boxes;
