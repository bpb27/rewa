import Image from 'next/image';
import { useEffect, useState, useMemo } from 'react';
import { type GetTopActorsResponse } from '~/api/get-top-actors';
import { type GetTopCrewResponse } from '~/api/get-top-crew';
import { ActorCardSidebar } from '~/components/actor-card-sidebar';
import { tmdbImage } from '~/components/images';
import Layout from '~/components/layout';
import { MovieCardSidebar } from '~/components/movie-card-sidebar';
import { type Boxes } from '~/components/ui/box';
import { rankByTotalMovies } from '~/utils/ranking';
import { sortByDate } from '~/utils/sorting';
import { cn } from '~/utils/style';

type TopCategoryProps = {
  category: 'actor' | 'director' | 'writer' | 'cinematographer' | 'producer';
  people: GetTopActorsResponse | GetTopCrewResponse;
};

const titles = {
  actor: 'Top Actors',
  cinematographer: 'Top Cinematographers',
  director: 'Top Directors',
  producer: 'Top Producers',
  writer: 'Top Writers',
};

export const TopCategory = ({ category, people }: TopCategoryProps) => {
  const isActor = useMemo(() => category === 'actor', [category]);

  const [selected, select] = useState<
    { movieId: number } | { actorId: number } | { movieId: number; actorId: number } | undefined
  >(undefined);

  // popup sidebar w/ first entry on desktop
  useEffect(() => {
    if (window.innerWidth > 1100) {
      const movieId = people[0].movies[0].id;
      const personId = people[0].id;
      select(isActor ? { movieId, actorId: personId } : { movieId });
    }
  }, [people, category, isActor]);

  return (
    <Layout title={titles[category]}>
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
        <Box.Page key={person.id}>
          {person.profile_path ? (
            <Box.ProfilePic>
              <Image
                className="h-full w-full rounded object-cover"
                src={tmdbImage(person.profile_path)}
                alt={`Image of ${person.name}`}
                fill
              />
            </Box.ProfilePic>
          ) : (
            <Box.EmptyProfilePic />
          )}
          <Box.HeaderAndMovies>
            <h3 className="text-lg sm:text-xl">
              <span
                className={cn(isActor && 'cursor-pointer hover:underline')}
                onClick={() => isActor && select({ actorId: person.id })}
              >
                #{person.rank} {person.name} with {person.movies.length} movies{' '}
              </span>
              <span className="text-gray-400">{person.ties > 1 && ` (T-${person.ties})`}</span>
            </h3>
            <Box.MovieBar>
              {person.movies
                .sort((a, b) => sortByDate(a.release_date, b.release_date))
                .map(m => (
                  <Image
                    key={m.id}
                    src={`https://image.tmdb.org/t/p/original${m.poster_path}`}
                    alt={`Movie poster for ${m.title}`}
                    width={40}
                    height={60}
                    className="m-1 scale-100 cursor-pointer border-2 border-black hover:scale-110 hover:drop-shadow-xl"
                    onClick={() =>
                      select(isActor ? { actorId: person.id, movieId: m.id } : { movieId: m.id })
                    }
                  />
                ))}
            </Box.MovieBar>
          </Box.HeaderAndMovies>
        </Box.Page>
      ))}
    </Layout>
  );
};

const Box = {
  Page: ({ children }) => (
    <div className="mb-8 flex flex-col items-start sm:flex-row sm:items-center">{children}</div>
  ),
  ProfilePic: ({ children }) => (
    <div className="relative mb-4 hidden sm:mb-0 sm:mr-4 sm:block sm:h-[200px] sm:w-[130px]">
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
    <div className="hide-scrollbar mt-2 flex space-x-2 overflow-x-scroll">{children}</div>
  ),
} satisfies Boxes;
