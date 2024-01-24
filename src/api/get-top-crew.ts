import { z } from 'zod';
import { crewJobs } from '~/data/crew-jobs';
import { movieModeFilter } from '~/data/movie-search-conditions';
import { Prisma } from '~/prisma';

const prisma = Prisma.getPrisma();

export const getTopCrewParams = z.object({
  mode: z.enum(['rewa', 'oscars']),
  job: z.enum(['director', 'producer', 'cinematographer', 'writer']),
});

// todo: use crewJobs in data
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

export const getTopCrew = async ({ job, mode }: z.infer<typeof getTopCrewParams>) => {
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
    where: {
      OR: crewJobs[job].map(item => ({ job: item })),
      AND: {
        movies: movieModeFilter(mode),
      },
    },
    take: 30,
  });

  const newData = await prisma.crew_on_movies.findMany({
    where: {
      AND: {
        crew_id: {
          in: top.map(p => p.crew_id!),
        },
        ...WHERE_JOB[job],
        movies: movieModeFilter(mode),
      },
    },
    select: {
      crew: {
        select: {
          id: true,
          name: true,
          profile_path: true,
        },
      },
      movies: {
        select: {
          id: true,
          poster_path: true,
          release_date: true,
          title: true,
        },
      },
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
    .map(entry => ({ ...entry.person, movies: entry.movies }))
    .sort((a, b) => b.movies.length - a.movies.length);

  return response;
};
