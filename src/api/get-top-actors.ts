import { uniqBy } from 'remeda';
import { Prisma } from '~/prisma';

export type GetTopActorsResponse = Awaited<ReturnType<typeof getTopActors>>;

const prisma = Prisma.getPrisma();

export const TOP_PEOPLE_MOVIE_SELECT = {
  select: {
    id: true,
    poster_path: true,
    release_date: true,
    title: true,
  },
};

export const getTopActors = async () => {
  const top = await prisma.actors_on_movies.groupBy({
    by: ['actor_id'],
    _count: {
      actor_id: true,
    },
    orderBy: {
      _count: {
        actor_id: 'desc',
      },
    },
    take: 100,
  });

  const allData = await prisma.actors.findMany({
    where: {
      id: {
        in: top.map(p => p.actor_id!),
      },
    },
    select: {
      name: true,
      id: true,
      profile_path: true,
      actors_on_movies: {
        select: { character: true, movies: TOP_PEOPLE_MOVIE_SELECT },
      },
    },
  });

  const people = allData
    .map(item => ({
      id: item.id,
      name: item.name,
      profile_path: item.profile_path,
      movies: uniqBy(
        item.actors_on_movies.map(movie => ({
          ...movie.movies!,
          character: movie.character,
        })),
        movie => movie.id
      ),
    }))
    .sort((a, b) => b.movies.length - a.movies.length);

  return people;
};
