import { useMemo, useState } from 'react';
import { MoviePoster, PersonPoster } from '~/components/images';
import Layout from '~/components/layout';
import { ActorCardSidebar } from '~/components/overlays/actor-card-sidebar';
import { MovieCardSidebar } from '~/components/overlays/movie-card-sidebar';
import { Crate, type Boxes } from '~/components/ui/box';
import { rankByTotalMovies } from '~/utils/ranking';
import { sortByDate } from '~/utils/sorting';
import { cn } from '~/utils/style';
import { Text } from './ui/text';

type TopCategoryProps = {
  category: keyof typeof titles;
  mode: 'rewa' | 'oscars';
  hideProfileImage?: boolean;
  people: {
    id: number;
    name: string;
    profile_path: string | null | undefined;
    movies: {
      id: number;
      title: string;
      release_date: string;
      poster_path: string;
    }[];
  }[];
};

export const TopCategory = ({ category, hideProfileImage, mode, people }: TopCategoryProps) => {
  const isActor = useMemo(() => category === 'actor' || category === 'actorNoms', [category]);
  const { heading, tab } = titles[category];
  type Selected = { movieId: number } | { actorId: number } | { movieId: number; actorId: number };
  const [selected, select] = useState<Selected | undefined>(undefined);

  return (
    <Layout title={tab}>
      {mode === 'oscars' && (
        <Crate mb={3} px={2} pt={3} pb={2} column alignCenter>
          <Text size="lg" bold>
            {heading}
          </Text>
        </Crate>
      )}
      {rankByTotalMovies(people).map(person => (
        <Box.Person key={person.id}>
          {!hideProfileImage && (
            <Box.ProfilePic>
              <PersonPoster
                name={person.name}
                poster_path={person.profile_path}
                variant="leaderboard"
              />
            </Box.ProfilePic>
          )}
          <Crate gap={3} column>
            <Text
              size="lg"
              className="ml-1 mt-2"
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
                  <Box.MoviePoster key={m.id}>
                    <MoviePoster
                      className="cursor-pointer hover:scale-110 hover:drop-shadow-xl"
                      poster_path={m.poster_path}
                      variant="leaderboard"
                      title={m.title}
                      onClick={() =>
                        select(isActor ? { actorId: person.id, movieId: m.id } : { movieId: m.id })
                      }
                    />
                  </Box.MoviePoster>
                ))}
            </Box.MovieBar>
          </Crate>
        </Box.Person>
      ))}
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
  MoviePoster: ({ children }) => <div className="shrink-0">{children}</div>,
} satisfies Boxes;

const pageTitle = 'the most Oscar-nominated movies (since 1950)';
const titles = {
  actor: {
    tab: 'Top Actors',
    heading: `Acted in ${pageTitle}`,
  },
  actorNoms: {
    tab: 'Top Actors (Oscar Nominations)',
    heading: `Best Actor and Supporting Actor nominations (since 1950)`,
  },
  cinematographer: {
    tab: 'Top Cinematographers',
    heading: `Filmed ${pageTitle}`,
  },
  director: {
    tab: 'Top Directors',
    heading: `Directed ${pageTitle}`,
  },
  directorNoms: {
    tab: 'Top Directors (Oscar Nominations)',
    heading: `Best Director nominations (since 1950)`,
  },
  producer: {
    tab: 'Top Producers',
    heading: `Produced ${pageTitle}`,
  },
  writer: {
    tab: 'Top Writers',
    heading: `Wrote ${pageTitle}`,
  },
};
