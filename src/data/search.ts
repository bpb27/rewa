import { Prisma } from '~/prisma';
import { relevantStreamers } from './relevant-streamers';

const prisma = Prisma.getPrisma();

export const searchMovies = async (searchString: string) => {
  const movies = await prisma.movies.findMany({
    select: { id: true, title: true },
    where: { title: { contains: searchString } },
    take: 5,
  });

  const actors = await prisma.actors.findMany({
    select: { id: true, name: true },
    where: { name: { contains: searchString } },
    take: 5,
  });

  const hosts = await prisma.hosts.findMany({
    select: { id: true, name: true },
    where: { name: { contains: searchString } },
    take: 5,
  });

  const streamers = await prisma.streamers.findMany({
    select: { id: true, name: true },
    where: {
      name: { contains: searchString },
      AND: {
        name: { in: relevantStreamers },
      },
    },
    take: 5,
  });

  const directors = await prisma.crew.findMany({
    select: { id: true, name: true },
    where: {
      name: { contains: searchString },
      AND: {
        crew_on_movies: {
          some: { job: 'Director' },
        },
      },
    },
    take: 5,
  });

  type Type = 'movie' | 'host' | 'actor' | 'streamer' | 'director';
  type Result = { id: number; name: string; type: Type };

  const results: Result[] = [
    ...movies.map(i => ({ type: 'movie' as Type, id: i.id, name: i.title })),
    ...hosts.map(i => ({ type: 'host' as Type, id: i.id, name: i.name })),
    ...actors.map(i => ({ type: 'actor' as Type, id: i.id, name: i.name })),
    ...directors.map(i => ({ type: 'director' as Type, id: i.id, name: i.name })),
    ...streamers.map(i => ({ type: 'streamer' as Type, id: i.id, name: i.name })),
  ];

  return results;
};
