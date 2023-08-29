import Image from 'next/image';
import { useEffect, useState } from 'react';
import { tmdbImage } from '~/components/images';
import { MovieCardSidebar } from '~/components/movie-card-sidebar';
import Layout from '~/components/layout';
import { rankByTotalMovies } from '~/utils/ranking';
import { sortByDate } from '~/utils/sorting';

type TopCategoryProps = {
  people: {
    id: number;
    profile_path?: string | null;
    name: string;
    movies: {
      id: number;
      title: string;
      poster_path: string;
      release_date: string;
    }[];
  }[];
  title: string;
};

export const TopCategory = ({ people, title }: TopCategoryProps) => {
  const [selectedMovie, setSelectedMovie] = useState<
    { movieId: number; personId: number } | undefined
  >(undefined);

  useEffect(() => {
    if (window.innerWidth > 1100) {
      setSelectedMovie({ movieId: people[0].movies[0].id, personId: people[0].id });
    }
  }, [people]);

  return (
    <Layout title={title}>
      {selectedMovie && (
        <MovieCardSidebar {...selectedMovie} onClose={() => setSelectedMovie(undefined)} />
      )}
      {rankByTotalMovies(people).map((person, i) => (
        <div key={person.id} className="mb-8 flex flex-col items-start sm:flex-row sm:items-center">
          {person.profile_path ? (
            <div className="relative mb-4 hidden sm:mb-0 sm:mr-4 sm:block sm:h-[200px] sm:w-[130px]">
              <Image
                className="h-full w-full rounded object-cover"
                src={tmdbImage(person.profile_path)}
                alt={`Image of ${person.name}`}
                fill
              />
            </div>
          ) : (
            <div className="relative mb-4 hidden bg-gradient-to-r from-gray-200 to-gray-500 sm:mb-0 sm:mr-4 sm:block sm:h-[200px] sm:w-[130px]"></div>
          )}
          <div className="flex w-full flex-col content-center">
            <h3 className="mb-2 text-lg sm:text-xl">
              #{person.rank} {person.name} with {person.movies.length} movies{' '}
              <span className="text-gray-400">{person.ties > 1 && ` (T-${person.ties})`}</span>
            </h3>
            <div className="hide-scrollbar flex space-x-2 overflow-x-scroll">
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
                    onClick={() => setSelectedMovie({ personId: person.id, movieId: m.id })}
                  />
                ))}
            </div>
          </div>
        </div>
      ))}
    </Layout>
  );
};
