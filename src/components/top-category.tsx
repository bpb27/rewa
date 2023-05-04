import Image from 'next/image';
import { sortByDate, tmdbImage } from '~/utils';
import { useState } from 'react';
import { Movie } from '~/components/movie';
import Layout from '~/components/layout';

type TopCategoryProps = {
  people: {
    id: number;
    profile_path?: string;
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
  >({ movieId: people[0].movies[0].id, personId: people[0].id });

  return (
    <Layout title={title}>
      {selectedMovie && (
        <Movie {...selectedMovie} onClose={() => setSelectedMovie(undefined)} />
      )}
      {people.map((person, i) => (
        <div key={person.id} className="flex items-center">
          {/* TODO: need a placeholder image if empty */}
          {person.profile_path && (
            <div>
              <Image
                src={tmdbImage(person.profile_path)}
                width={130}
                height={200}
                alt={`Image of ${person.name}`}
              />
            </div>
          )}
          <div className="flex flex-col content-center">
            <h3 className="mb-2 text-xl">
              #{i + 1} {person.name} with {person.movies.length} movies
            </h3>
            <div className="flex items-stretch">
              {person.movies
                .sort((a, b) => sortByDate(a.release_date, b.release_date))
                .map((m) => (
                  <Image
                    key={m.id}
                    src={`https://image.tmdb.org/t/p/original${m.poster_path}`}
                    alt={`Movie poster for ${m.title}`}
                    width={50}
                    height={76}
                    className="m-1 border-2 border-black cursor-pointer"
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
