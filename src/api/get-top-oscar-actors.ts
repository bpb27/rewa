import { Prisma } from '~/prisma';
import { TOP_PEOPLE_MOVIE_SELECT } from './get-top-actors';

const prisma = Prisma.getPrisma();

// nice to filter by won and supporting

export const getTopOscarActors = async () => {
  const response = await prisma.actors_on_oscars.findMany({
    select: {
      actors: {
        select: { id: true, name: true, profile_path: true },
      },
      oscars_nominations: {
        include: {
          award: {
            include: {
              oscars_categories: true,
            },
          },
          movie: { ...TOP_PEOPLE_MOVIE_SELECT },
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
    const actor = item.actors;
    const movie = {
      ...item.oscars_nominations.movie,
      award: item.oscars_nominations.award.oscars_categories.name,
    };
    if (hash[actor.id]) {
      hash[actor.id].movies.push(movie);
    } else {
      hash[actor.id] = { ...actor, movies: [movie] };
    }
    return hash;
  }, {} as Record<number, Actor>);

  return Object.values(mapped)
    .sort((a, b) => b.movies.length - a.movies.length)
    .filter(a => a.movies.length >= 3);
};
