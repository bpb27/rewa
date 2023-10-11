import { type Prisma as PrismaBaseType } from '@prisma/client';
import { isArray } from 'remeda';
import { type QpSchema, type TokenType } from '~/data/query-params';

type AndOr = PrismaBaseType.moviesWhereInput['OR'] | PrismaBaseType.moviesWhereInput['AND'];

type SearchFn = (
  list: number[]
) => PrismaBaseType.moviesWhereInput['OR'] | PrismaBaseType.moviesWhereInput['AND'];

export const createFilters = (mode: 'OR' | 'AND', conditions: AndOr[]) =>
  conditions.map(condition => ({ [mode]: condition }));

const fiveMil = 5000000;

// TODO: see if in works in some of these cases

export const searchMap: Record<TokenType, SearchFn> = {
  actor: actors =>
    actors.map(id => ({
      actors_on_movies: {
        some: {
          actor_id: id,
        },
      },
    })),
  budget: budgets =>
    budgets.map(budget => ({
      budget: {
        gt: budget - fiveMil,
        lt: budget + fiveMil,
      },
    })),
  director: directors =>
    directors.map(id => ({
      crew_on_movies: {
        some: {
          job: 'Director',
          crew_id: id,
        },
      },
    })),
  genre: genres =>
    genres.map(id => ({
      genres_on_movies: {
        some: {
          genre_id: id,
        },
      },
    })),
  host: hosts =>
    hosts.map(id => ({
      episodes: {
        some: {
          hosts_on_episodes: {
            some: {
              host_id: id,
            },
          },
        },
      },
    })),
  movie: movies =>
    movies.map(id => ({
      id: id,
    })),
  oscarCategory: categories =>
    categories.map(id => ({
      oscars_nominations: {
        some: {
          award: {
            category_id: id,
          },
        },
      },
    })),
  revenue: revenues =>
    revenues.map(revenue => ({
      // NB: revenues are stored in the DB as revenue / 1000 (big int shit)
      revenue: {
        gt: revenue / 1000 - fiveMil / 1000,
        lt: revenue / 1000 + fiveMil / 1000,
      },
    })),
  runtime: runtimes =>
    runtimes.map(runtime => ({
      runtime: {
        gt: runtime - 5,
        lt: runtime + 5,
      },
    })),
  streamer: streamers =>
    streamers.map(id => ({
      streamers_on_movies: {
        some: {
          streamer_id: id,
        },
      },
    })),
  year: years =>
    years.map(year => ({
      release_date: {
        startsWith: year.toString(),
      },
    })),
  yearRange: years =>
    years.map((year, i) => ({
      release_date: {
        [i ? 'lte' : 'gte']: year.toString(),
      },
    })),
};

export const getSearches = (options: QpSchema) => {
  return Object.entries(options)
    .map(([key, value]) => {
      if (isArray(value) && value.length && key in searchMap) {
        const search = searchMap[key as keyof typeof searchMap];
        return search(value);
      } else {
        return undefined;
      }
    })
    .filter(Boolean);
};
