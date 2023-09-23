import { Prisma } from '~/prisma';
import { TOP_PEOPLE_MOVIE_SELECT } from './get-top-actors';

export type GetTopCrewResponse = Awaited<ReturnType<typeof getTopCrew>>;

const prisma = Prisma.getPrisma();

const WHERE_JOB = {
  director: {
    job: 'Director',
  },
  producer: {
    job: 'Producer',
  },
  cinematographer: {
    OR: [{ job: 'Cinematography' }, { job: 'Director of Photography' }],
  },
  writer: {
    OR: [{ job: 'Screenplay' }, { job: 'Writer' }],
  },
};

export const getTopCrew = async (job: keyof typeof WHERE_JOB) => {
  const top = await prisma.crew_on_movies.groupBy({
    by: ['crew_id'],
    _count: {
      crew_id: true,
    },
    orderBy: {
      _count: {
        crew_id: 'desc',
      },
    },
    where: WHERE_JOB[job],
    take: 30,
  });

  const newData = await prisma.crew_on_movies.findMany({
    where: {
      AND: {
        crew_id: {
          in: top.map(p => p.crew_id!),
        },
        ...WHERE_JOB[job],
      },
    },
    include: {
      crew: {
        select: {
          id: true,
          name: true,
          profile_path: true,
        },
      },
      movies: { select: TOP_PEOPLE_MOVIE_SELECT.select },
    },
  });

  const parsed = newData.reduce<{
    [id: number]: {
      person: NonNullable<(typeof newData)[number]['crew']>;
      movies: NonNullable<(typeof newData)[number]['movies']>[];
    };
  }>((hash, item) => {
    if (!item.crew || !item.movies) return hash;
    if (hash[item.crew.id]) {
      hash[item.crew.id].movies.push(item.movies);
    } else {
      hash[item.crew.id] = {
        person: item.crew,
        movies: [item.movies],
      };
    }
    return hash;
  }, {});

  const response = Object.values(parsed)
    .sort((a, b) => b.movies.length - a.movies.length)
    .map(entry => ({
      ...entry.person,
      movies: entry.movies,
    }));

  return response;
};
