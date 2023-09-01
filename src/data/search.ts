import { Prisma } from '~/prisma';

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

  type Type = 'movie' | 'host' | 'actor';
  type Result = { id: number; name: string; type: Type };

  const results: Result[] = [
    ...movies.map(i => ({ type: 'movie' as Type, id: i.id, name: i.title })),
    ...hosts.map(i => ({ type: 'host' as Type, id: i.id, name: i.name })),
    ...actors.map(i => ({ type: 'actor' as Type, id: i.id, name: i.name })),
  ];

  return results;
};
