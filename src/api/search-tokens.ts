import { z } from 'zod';
import { relevantStreamers } from '~/data/streamers';
import { tokenize } from '~/data/tokens';
import { Prisma } from '~/prisma';

const prisma = Prisma.getPrisma();

export const searchTokensParams = z.object({
  filter: z.enum(['rewa', 'oscar', 'any']),
  search: z.string(),
});

export const searchTokens = async ({ filter, search }: z.infer<typeof searchTokensParams>) => {
  const filterField = filter === 'rewa' ? ('episodes' as const) : ('oscars_nominations' as const);

  const movies = await prisma.movies.findMany({
    select: { id: true, title: true },
    orderBy: { title: 'asc' },
    where: {
      title: { contains: search },
      AND: { [filterField]: { some: {} } },
    },
    take: 5,
  });

  const actors = await prisma.actors.findMany({
    select: { id: true, name: true },
    orderBy: { actors_on_movies: { _count: 'desc' } },
    where: {
      name: { contains: search },
      AND: { actors_on_movies: { some: { movies: { [filterField]: { some: {} } } } } },
    },
    take: 5,
  });

  const hosts = await prisma.hosts.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
    where: { name: { contains: search } },
    take: 5,
  });

  const keywords = await prisma.keywords.findMany({
    select: { id: true, name: true },
    orderBy: { keywords_on_movies: { _count: 'desc' } },
    where: {
      name: { contains: search },
      AND: { keywords_on_movies: { some: { movies: { [filterField]: { some: {} } } } } },
    },
    take: 5,
  });

  const streamers = await prisma.streamers.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
    where: {
      name: { contains: search },
      AND: {
        name: { in: relevantStreamers },
      },
    },
    take: 5,
  });

  const directors = await prisma.crew.findMany({
    select: { id: true, name: true },
    orderBy: { crew_on_movies: { _count: 'desc' } },
    where: {
      name: { contains: search },
      AND: [
        {
          crew_on_movies: {
            some: {
              job: 'Director',
              movies: { [filterField]: { some: {} } },
            },
          },
        },
      ],
    },
    take: 5,
  });

  const results = [
    ...movies.map(item => tokenize('movie', item)),
    ...hosts.map(item => tokenize('host', item)),
    ...actors.map(item => tokenize('actor', item)),
    ...directors.map(item => tokenize('director', item)),
    ...streamers.map(item => tokenize('streamer', item)),
    ...keywords.map(item => tokenize('keyword', item)),
  ];

  return results;
};
