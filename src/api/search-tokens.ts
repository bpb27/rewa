import { uniqBy } from 'remeda';
import { z } from 'zod';
import { crewJobs } from '~/data/crew-jobs';
import { relevantStreamers } from '~/data/streamers';
import { tokenize, tokenizeYear, tokenizeYearGte, tokenizeYearLte } from '~/data/tokens';
import { Prisma } from '~/prisma';
import { appEnums } from '~/utils/enums';
import { getYear } from '~/utils/format';
import { isInteger, isYear } from '~/utils/validate';

const prisma = Prisma.getPrisma();

export const searchTokensParams = z.object({
  filter: appEnums.movieMode.schema,
  search: z.string(),
});

export const searchTokens = async ({ filter, search }: z.infer<typeof searchTokensParams>) => {
  const filterField = filter === 'rewa' ? ('episodes' as const) : ('oscars_nominations' as const);

  const searchCrew = (jobIds: number[], take: number) =>
    prisma.crew.findMany({
      select: { id: true, name: true },
      orderBy: { crew_on_movies: { _count: 'desc' } },
      where: {
        name: { contains: search },
        AND: [
          {
            crew_on_movies: {
              some: {
                job_id: { in: jobIds },
                movies: { [filterField]: { some: {} } },
              },
            },
          },
        ],
      },
      take,
    });

  const [
    exactMovies,
    movies,
    actors,
    hosts,
    keywords,
    streamers,
    directors,
    cinematographers,
    writers,
    producers,
  ] = await Promise.all([
    // exact match is for short movie titles that may be cutoff in the subsequent query - e.g. the movie "Z"
    // NB: title.equals is case sensitive, so using SW/EW
    prisma.movies.findMany({
      select: { id: true, title: true, release_date: true },
      orderBy: { release_date: 'desc' },
      where: {
        AND: [
          { title: { startsWith: search } },
          { title: { endsWith: search } },
          { [filterField]: { some: {} } },
        ],
      },
    }),

    prisma.movies.findMany({
      select: { id: true, title: true, release_date: true },
      orderBy: { title: 'asc' },
      where: {
        title: { contains: search },
        AND: { [filterField]: { some: {} } },
      },
      take: 3,
    }),

    prisma.actors.findMany({
      select: { id: true, name: true },
      orderBy: { actors_on_movies: { _count: 'desc' } },
      where: {
        name: { contains: search },
        AND: { actors_on_movies: { some: { movies: { [filterField]: { some: {} } } } } },
      },
      take: 3,
    }),

    prisma.hosts.findMany({
      select: { id: true, name: true },
      orderBy: { hosts_on_episodes: { _count: 'desc' } },
      where: { name: { contains: search } },
      take: 3,
    }),

    prisma.keywords.findMany({
      select: { id: true, name: true },
      orderBy: { keywords_on_movies: { _count: 'desc' } },
      where: {
        name: { contains: search },
        AND: { keywords_on_movies: { some: { movies: { [filterField]: { some: {} } } } } },
      },
      take: 3,
    }),

    prisma.streamers.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
      where: {
        name: { contains: search },
        AND: {
          name: { in: relevantStreamers },
        },
      },
      take: 3,
    }),

    searchCrew(crewJobs.director, 3),

    searchCrew(crewJobs.cinematographer, 1),

    searchCrew(crewJobs.writer, 1),

    searchCrew(crewJobs.producer, 1),
  ]);

  const results = [
    ...uniqBy([...exactMovies, ...movies], m => m.id)
      .slice(0, 3)
      .map(item => ({ ...item, title: `${item.title} (${getYear(item.release_date)})` }))
      .map(item => tokenize('movie', item)),
    ...(filter === 'rewa' ? hosts : []).map(item => tokenize('host', item)),
    ...actors.map(item => tokenize('actor', item)),
    ...directors.map(item => tokenize('director', item)),
    ...cinematographers.map(item => tokenize('cinematographer', item)),
    ...writers.map(item => tokenize('writer', item)),
    ...producers.map(item => tokenize('producer', item)),
    ...streamers.map(item => tokenize('streamer', item)),
    ...keywords.map(item => tokenize('keyword', item)),
  ];

  if (isInteger(search) && pickYear(search)) {
    const year = pickYear(search);
    results.push(tokenizeYear(year));
    results.push(tokenizeYearGte(year));
    results.push(tokenizeYearLte(year));
  }

  return results;
};

const pickYear = (str: string) => {
  if (isYear(str)) {
    return str;
  } else if (str === '1' || str === '19') {
    return '1999';
  } else if (str === '2' || str === '20') {
    return '2000';
  } else if (str.length === 3 && !!(str.startsWith('19') || str.startsWith('20'))) {
    return str + '0';
  } else {
    return '';
  }
};
