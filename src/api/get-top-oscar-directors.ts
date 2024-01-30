import { crewJobs } from '~/data/crew-jobs';
import { Prisma } from '~/prisma';
import { TOP_PEOPLE_MOVIE_SELECT } from './get-top-actors';

const prisma = Prisma.getPrisma();

export const getTopOscarDirectors = async () => {
  const response = await prisma.crew_on_oscars.findMany({
    select: {
      crew: {
        select: { id: true, name: true, profile_path: true },
      },
      oscars_nominations: {
        include: {
          award: {
            include: {
              oscars_categories: true,
            },
          },
          movie: {
            select: {
              ...TOP_PEOPLE_MOVIE_SELECT.select,
              crew_on_movies: {
                where: {
                  job: { in: crewJobs.director },
                },
              },
            },
          },
        },
      },
    },
  });

  type Actor = {
    id: number;
    name: string;
    profile_path: string | undefined | null;
    movies: {
      id: number;
      title: string;
      release_date: string;
      poster_path: string;
      award: string;
    }[];
  };

  const mapped = response.reduce((hash, item) => {
    const director = item.crew;
    const movie = {
      ...item.oscars_nominations.movie,
      award: item.oscars_nominations.award.oscars_categories.name,
    };
    if (movie.crew_on_movies.find(c => c.crew_id !== director.id)) return hash;
    if (hash[director.id]) {
      hash[director.id].movies.push(movie);
    } else {
      hash[director.id] = { ...director, movies: [movie] };
    }
    return hash;
  }, {} as Record<number, Actor>);

  return Object.values(mapped)
    .sort((a, b) => b.movies.length - a.movies.length)
    .filter(a => a.movies.length >= 3);
};
