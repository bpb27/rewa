import { uniqBy } from 'remeda';
import { z } from 'zod';
import { Prisma } from '~/prisma';

const prisma = Prisma.getPrisma();

export const getTopActorsParams = z.object({
  mode: z.enum(['rewa', 'oscars']),
});

export const TOP_PEOPLE_MOVIE_SELECT = {
  select: {
    id: true,
    poster_path: true,
    release_date: true,
    title: true,
  },
};

export const getTopActors = async ({ mode }: z.infer<typeof getTopActorsParams>) => {
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
    where: {
      movies: {
        ...(mode === 'oscars' ? { oscars_nominations: { some: {} } } : undefined),
        ...(mode === 'rewa' ? { episodes: { some: {} } } : undefined),
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
        select: {
          character: true,
          movies: {
            select: {
              id: true,
              poster_path: true,
              release_date: true,
              title: true,
              episodes: { select: { id: true } },
              oscars_nominations: { select: { id: true } },
            },
          },
        },
      },
    },
  });

  const people = allData
    .map(item => ({
      id: item.id,
      name: item.name,
      profile_path: item.profile_path,
      movies: uniqBy(
        item.actors_on_movies
          .map(movie => ({
            ...movie.movies!,
            character: movie.character,
          }))
          .filter(aom => {
            if (mode === 'oscars') return aom.oscars_nominations.length;
            if (mode === 'rewa') return aom.episodes.length;
            return true;
          }),
        movie => movie.id
      ),
    }))
    .sort((a, b) => b.movies.length - a.movies.length);

  return people;
};
