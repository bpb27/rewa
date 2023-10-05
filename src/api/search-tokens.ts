import { type Prisma as PrismaBaseType } from '@prisma/client';
import { Prisma } from '~/prisma';
import { relevantStreamers } from '~/data/streamers';
import { tokenize } from '~/data/tokens';
import { isDefined } from 'remeda';

const prisma = Prisma.getPrisma();

export type SearchTokensParams = {
  filter: 'episode' | 'oscar';
  search: string;
};
export type SearchTokensResponse = Awaited<ReturnType<typeof searchTokens>>;

export const searchTokens = async ({ filter, search }: SearchTokensParams) => {
  const filterField =
    filter === 'episode' ? ('episodes' as const) : ('oscars_nominations' as const);

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
    orderBy: { name: 'asc' },
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
    orderBy: { name: 'asc' },
    where: {
      name: { contains: search },
      AND: [
        { crew_on_movies: { some: { job: 'Director' } } },
        { crew_on_movies: { some: { movies: { [filterField]: { some: {} } } } } },
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
  ];

  return results;
};
