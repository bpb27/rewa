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
      <div className="mb-2 flex justify-center text-sm md:text-base">
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
          className="mb-8 flex flex-col items-start sm:flex-row sm:items-center"
        >
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
              #{i + 1} {person.name} with {person.movies.length} movies
            </h3>
            <div className="hide-scrollbar flex space-x-2 overflow-x-scroll">
              {person.movies
                .sort((a, b) => sortByDate(a.release_date, b.release_date))
                .map((m) => (
                  <Image
                    key={m.id}
                    src={`https://image.tmdb.org/t/p/original${m.poster_path}`}
                    alt={`Movie poster for ${m.title}`}
                    width={40}
                    height={60}
                    className="m-1 scale-100 cursor-pointer border-2 border-black hover:scale-110 hover:drop-shadow-xl"
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
