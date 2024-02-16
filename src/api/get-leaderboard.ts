import { Prisma as PrismaBaseType } from '@prisma/client';
import { z } from 'zod';
import { crewJobs } from '~/data/crew-jobs';
import { movieFilters } from '~/data/movie-search-conditions';
import { parsedQpSchema } from '~/data/query-params';
import { Prisma } from '~/prisma';
import { appEnums } from '~/utils/enums';
import { sortLeaderboard, sortMovies } from '~/utils/sorting';

type Params = z.infer<typeof getLeaderboardParams>;
type MovieSelect = Pick<PrismaBaseType.moviesFindManyArgs, 'select'>;
type ActorSelect = Pick<PrismaBaseType.actorsFindManyArgs, 'select'>;
type CrewSelect = Pick<PrismaBaseType.crewFindManyArgs, 'select'>;
type GetTop = (params: Params) => Promise<Person[]>;
type Person = {
  id: number;
  name: string;
  image: string | undefined | null;
  cumulativeCreditOrder?: number;
  movies: {
    id: number;
    title: string;
    image: string;
    award?: { category: string; won: boolean };
    character?: string;
    releaseDate: string;
  }[];
};

const prisma = Prisma.getPrisma();

export const getLeaderboardParams = z.object({
  field: appEnums.topCategory.schema,
  subField: appEnums.topCategorySub.schema,
  params: parsedQpSchema,
});

const callback = (people: Person[]) => ({
  hasNext: false,
  page: 0,
  results: people,
  total: people.length,
});

export const getLeaderboard = async (params: Params) => {
  if (params.subField === 'mostFilms') {
    if (params.field === 'actor') {
      return getTopActors(params).then(callback);
    } else {
      return getTopCrew(params).then(callback);
    }
  } else {
    if (params.field === 'actor') {
      return getTopOscarActors(params).then(callback);
    } else {
      return getTopOscarCrew(params).then(callback);
    }
  }
};

const select = {
  movie: { id: true, poster_path: true, release_date: true, title: true },
  actor: { id: true, profile_path: true, name: true },
  crew: { id: true, profile_path: true, name: true },
} satisfies {
  movie: MovieSelect['select'];
  actor: ActorSelect['select'];
  crew: CrewSelect['select'];
};

const getTopActors: GetTop = async ({ params }) => {
  const ids = await prisma.actors_on_movies.groupBy({
    by: ['actor_id'],
    _count: { actor_id: true },
    orderBy: { _count: { actor_id: 'desc' } },
    where: { movies: movieFilters(params) },
    take: 100,
  });

  const people = await prisma.actors.findMany({
    where: { id: { in: ids.map(a => a.actor_id) } },
    select: {
      ...select.actor,
      actors_on_movies: {
        orderBy: { movies: { release_date: 'asc' } },
        where: { movies: movieFilters(params) },
        select: { character: true, credit_order: true, movies: { select: select.movie } },
      },
    },
  });

  const mapped = people.map(p => ({
    id: p.id,
    name: p.name,
    image: p.profile_path,
    cumulativeCreditOrder: p.actors_on_movies.reduce((sum, aom) => sum + aom.credit_order, 0),
    movies: sortMovies(
      p.actors_on_movies.map(aom => ({
        character: aom.character,
        id: aom.movies.id,
        image: aom.movies.poster_path,
        title: aom.movies.title,
        releaseDate: aom.movies.release_date,
      }))
    ),
  }));

  return sortLeaderboard(mapped);
};

const getTopCrew: GetTop = async ({ field, params }) => {
  if (field === 'actor') return [];

  const ids = await prisma.crew_on_movies.groupBy({
    by: ['crew_id'],
    _count: { crew_id: true },
    orderBy: { _count: { crew_id: 'desc' } },
    where: {
      job_id: { in: crewJobs[field] },
      movies: movieFilters(params),
    },
    take: 100,
  });

  const people = await prisma.crew.findMany({
    where: { id: { in: ids.map(a => a.crew_id) } },
    select: {
      ...select.crew,
      crew_on_movies: {
        where: {
          job_id: { in: crewJobs[field] },
          movies: movieFilters(params),
        },
        select: { movies: { select: select.movie } },
        orderBy: { movies: { release_date: 'asc' } },
      },
    },
  });

  const mapped = people.map(p => ({
    id: p.id,
    name: p.name,
    image: p.profile_path,
    movies: sortMovies(
      p.crew_on_movies.map(om => ({
        id: om.movies.id,
        image: om.movies.poster_path,
        title: om.movies.title,
        releaseDate: om.movies.release_date,
      }))
    ),
  }));

  return sortLeaderboard(mapped);
};

const getTopOscarActors: GetTop = async ({ params, subField }) => {
  const response = await prisma.actors_on_oscars.findMany({
    where: {
      oscars_nominations: {
        movie: movieFilters(params),
        ...(subField === 'mostWins' ? { won: true } : undefined),
      },
    },
    select: {
      actors: {
        select: select.actor,
      },
      oscars_nominations: {
        include: {
          award: {
            include: {
              oscars_categories: true,
            },
          },
          movie: {
            select: {
              ...select.movie,
              actors_on_movies: {
                select: { actor_id: true, character: true, credit_order: true },
              },
            },
          },
        },
      },
    },
  });

  const mapped = response.reduce((hash, item) => {
    const actor = {
      id: item.actors.id,
      name: item.actors.name,
      image: item.actors.profile_path,
    };

    const movie: Person['movies'][number] = {
      id: item.oscars_nominations.movie.id,
      title: item.oscars_nominations.movie.title,
      image: item.oscars_nominations.movie.poster_path,
      character: item.oscars_nominations.movie.actors_on_movies.find(
        aom => aom.actor_id === actor.id
      )?.character,
      releaseDate: item.oscars_nominations.movie.release_date,
      award: {
        category: item.oscars_nominations.award.oscars_categories.name,
        won: item.oscars_nominations.won,
      },
    };

    if (hash[actor.id]) {
      hash[actor.id].movies.push(movie);
    } else {
      hash[actor.id] = { ...actor, movies: [movie] };
    }

    return hash;
  }, {} as Record<number, Person>);

  const list = Object.values(mapped).map(a => ({ ...a, movies: sortMovies(a.movies) }));
  return sortLeaderboard(list).slice(0, 100);
};

const getTopOscarCrew: GetTop = async ({ field, params, subField }) => {
  const response = await prisma.crew_on_oscars.findMany({
    where: {
      oscars_nominations: {
        movie: movieFilters(params),
        ...(subField === 'mostWins' ? { won: true } : undefined),
        // TODO: use category name
        award: {
          ...(field === 'cinematographer' && { category_id: 6 }),
          ...(field === 'director' && { category_id: 8 }),
          ...(field === 'writer' && { category_id: { in: [22, 23] } }),
        },
      },
    },
    select: {
      crew: {
        select: select.crew,
      },
      oscars_nominations: {
        include: {
          award: {
            include: {
              oscars_categories: true,
            },
          },
          movie: {
            select: {
              ...select.movie,
              crew_on_movies: {
                select: { crew_id: true },
              },
            },
          },
        },
      },
    },
  });

  const mapped = response.reduce((hash, item) => {
    const crew = {
      id: item.crew.id,
      name: item.crew.name,
      image: item.crew.profile_path,
    };

    const movie: Person['movies'][number] = {
      id: item.oscars_nominations.movie.id,
      title: item.oscars_nominations.movie.title,
      image: item.oscars_nominations.movie.poster_path,
      releaseDate: item.oscars_nominations.movie.release_date,
      award: {
        category: item.oscars_nominations.award.oscars_categories.name,
        won: item.oscars_nominations.won,
      },
    };

    if (hash[crew.id]) {
      hash[crew.id].movies.push(movie);
    } else {
      hash[crew.id] = { ...crew, movies: [movie] };
    }

    return hash;
  }, {} as Record<number, Person>);

  const list = Object.values(mapped).map(a => ({ ...a, movies: sortMovies(a.movies) }));
  return sortLeaderboard(list).slice(0, 100);
};
