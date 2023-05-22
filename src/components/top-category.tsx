import Image from 'next/image';
import { sortByDate, tmdbImage } from '~/utils';
import { PropsWithChildren, useEffect, useState } from 'react';
import { Movie } from '~/components/movie';
import Layout from '~/components/layout';
import Link from 'next/link';

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

  const linkClass =
    'p-2 text-blue-50 bg-slate-600 hover:bg-slate-500 font-semibold sm:m-1 sm:rounded';
  return (
    <Layout title={title}>
      <div className="flex justify-center text-sm md:text-base mb-2">
        <Link href="/top/actors" className={linkClass}>
          Actors
        </Link>
        <Link href="/top/directors" className={linkClass}>
          Directors
        </Link>
        <Link href="/top/producers" className={linkClass}>
          Producers
        </Link>
        <Link href="/top/writers" className={linkClass}>
          Writers
        </Link>
        <Link
          href="/top/cinematographers"
          className={`${linkClass} hidden sm:inline-block`}
        >
          Cinematographers
        </Link>
      </div>
      {selectedMovie && (
        <Movie {...selectedMovie} onClose={() => setSelectedMovie(undefined)} />
      )}
      {people.map((person, i) => (
        <div
          key={person.id}
          className="flex flex-col sm:flex-row items-start sm:items-center mb-8"
        >
          {/* TODO: need a placeholder image if empty */}
          {person.profile_path ? (
            <div className="hidden sm:block sm:w-[130px] sm:h-[200px] relative mb-4 sm:mb-0 sm:mr-4">
              <Image
                className="w-full h-full object-cover rounded"
                src={tmdbImage(person.profile_path)}
                alt={`Image of ${person.name}`}
                fill
              />
            </div>
          ) : (
            <div className="hidden sm:block bg-gradient-to-r from-gray-200 to-gray-500 sm:w-[130px] sm:h-[200px] relative mb-4 sm:mb-0 sm:mr-4"></div>
          )}
          <div className="flex flex-col content-center w-full">
            <h3 className="mb-2 text-lg sm:text-xl">
              #{i + 1} {person.name} with {person.movies.length} movies
            </h3>
            <div className="overflow-x-scroll hide-scrollbar flex space-x-2">
              {person.movies
                .sort((a, b) => sortByDate(a.release_date, b.release_date))
                .map((m) => (
                  <Image
                    key={m.id}
                    src={`https://image.tmdb.org/t/p/original${m.poster_path}`}
                    alt={`Movie poster for ${m.title}`}
                    width={40}
                    height={60}
                    className="m-1 border-2 border-black cursor-pointer scale-100 hover:scale-110 hover:drop-shadow-xl"
                    onClick={() =>
                      setSelectedMovie({ personId: person.id, movieId: m.id })
                    }
                  />
                ))}
            </div>
          </div>
        </div>
      ))}
    </Layout>
  );
};

const useDelayedRender = (delay: number) => {
  const [delayed, setDelayed] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => setDelayed(false), delay);
    return () => clearTimeout(timeout);
  }, [delay]);
  return (fn: any) => !delayed && fn();
};

const DelayedRender = ({
  delay,
  children,
}: PropsWithChildren<{ delay: number }>) =>
  useDelayedRender(delay)(() => children);
