import { type Prisma as PrismaBaseType } from '@prisma/client';
import { isArray } from 'remeda';
import { type QpSchema, type TokenType } from '~/data/query-params';
import { crewJobs } from './crew-jobs';

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
  budgetGte: budgets =>
    budgets.map(budget => ({
      budget: {
        gte: budget,
      },
    })),
  budgetLte: budgets =>
    budgets.map(budget => ({
      budget: {
        lte: budget,
      },
    })),
  cinematographer: cinematographers =>
    cinematographers.map(id => ({
      crew_on_movies: {
        some: {
          job: { in: crewJobs.cinematographer },
          crew_id: id,
        },
      },
    })),
  director: directors =>
    directors.map(id => ({
      crew_on_movies: {
        some: {
          job: { in: crewJobs.director },
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
  keyword: keywords =>
    keywords.map(id => ({
      keywords_on_movies: {
        some: {
          keyword_id: id,
        },
      },
    })),
  movie: movies =>
    movies.map(id => ({
      id: id,
    })),
  oscarsCategoriesNom: categories =>
    categories.map(id => ({
      oscars_nominations: {
        some: {
          award: {
            category_id: id,
          },
        },
      },
    })),
  oscarsCategoriesWon: categories =>
    categories.map(id => ({
      oscars_nominations: {
        some: {
          won: true,
          award: {
            category_id: id,
          },
        },
      },
    })),
  producer: producers =>
    producers.map(id => ({
      crew_on_movies: {
        some: {
          job: { in: crewJobs.producer },
          crew_id: id,
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
  revenueGte: revenues =>
    revenues.map(revenue => ({
      // NB: revenues are stored in the DB as revenue / 1000 (big int shit)
      revenue: {
        gte: revenue / 1000,
      },
    })),
  revenueLte: revenues =>
    revenues.map(revenue => ({
      // NB: revenues are stored in the DB as revenue / 1000 (big int shit)
      revenue: {
        lte: revenue / 1000,
      },
    })),
  runtime: runtimes =>
    runtimes.map(runtime => ({
      runtime: {
        gt: runtime - 5,
        lt: runtime + 5,
      },
    })),
  runtimeGte: runtimes =>
    runtimes.map(runtime => ({
      runtime: {
        gte: runtime,
      },
    })),
  runtimeLte: runtimes =>
    runtimes.map(runtime => ({
      runtime: {
        lte: runtime,
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
  writer: writers =>
    writers.map(id => ({
      crew_on_movies: {
        some: {
          job: { in: crewJobs.writer },
          crew_id: id,
        },
      },
    })),
  year: years =>
    years.map(year => ({
      release_date: {
        startsWith: year.toString(),
      },
    })),
  yearGte: years =>
    years.map(year => ({
      release_date: {
        gte: year.toString(),
      },
    })),
  yearLte: years =>
    years.map(year => ({
      release_date: {
        lte: year.toString(),
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
