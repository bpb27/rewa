import { uniqBy } from 'remeda';
import { Prisma } from '~/prisma';

const prisma = Prisma.getPrisma();

const TAKE = 30;

const MOVIE_SELECT = {
  select: {
    id: true,
    poster_path: true,
    release_date: true,
    title: true,
  },
};

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

export const getActors = async () => {
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
    take: TAKE,
  });

  const allData = await prisma.actors.findMany({
    where: {
      id: {
        in: top.map((p) => p.actor_id!),
      },
    },
    select: {
      name: true,
      id: true,
      profile_path: true,
      actors_on_movies: {
        select: { character: true, movies: MOVIE_SELECT },
      },
    },
  });

  const people = allData
    .map((item) => ({
      id: item.id,
      name: item.name,
      profile_path: item.profile_path,
      movies: uniqBy(
        item.actors_on_movies.map((movie) => ({
          ...movie.movies!,
          character: movie.character,
        })),
        (movie) => movie.id
      ),
    }))
    .sort((a, b) => b.movies.length - a.movies.length);

  return people;
};

export const getCrew = async (job: keyof typeof WHERE_JOB) => {
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
    take: TAKE,
  });

  const newData = await prisma.crew_on_movies.findMany({
    where: {
      AND: {
        crew_id: {
          in: top.map((p) => p.crew_id!),
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
      movies: { select: MOVIE_SELECT.select },
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
    .map((entry) => ({
      ...entry.person,
      movies: entry.movies,
    }));

  return response;
};
