import { pick, uniqBy } from 'remeda';
import { createFilters, getSearches } from '~/data/movie-search-conditions';
import { QpSchema } from '~/data/query-params';
import {
  tokenizeBudget,
  tokenizeRevenue,
  tokenizeRuntime,
  tokenizeYear,
  tokenize,
} from '~/data/tokens';
import { Prisma } from '~/prisma';
import { Prisma as PrismaBaseType } from '@prisma/client';

// NB: mode AND === all conditions present, mode OR === any conditions present
// NB: can't sort across tables via prisma (need separate queries)

const prisma = Prisma.getPrisma();
const selectIdAndName = { select: { id: true, name: true } };
const take = 25;

type FindManyArgs = PrismaBaseType.moviesFindManyArgs;

export type GetMoviesResponse = Awaited<ReturnType<typeof getMovies>>;

export const getMovies = async (params: QpSchema) => {
  const mode = params.mode.toUpperCase() as 'AND' | 'OR';
  const sortOrder = params.asc ? 'asc' : 'desc';
  const searches = getSearches(params);
  const prismaSearch = searches.length ? { [mode]: createFilters(mode, searches) } : undefined;

  const where: Pick<FindManyArgs, 'where'> = {
    where: {
      ...(params.hasEpisode ? { episodes: { some: {} } } : undefined),
      ...(params.hasOscar ? { oscars_nominations: { some: {} } } : undefined),
      ...prismaSearch,
    },
  };

  const cursor: Pick<FindManyArgs, 'cursor'> | undefined = params.movieCursor
    ? { cursor: { id: params.movieCursor } }
    : undefined;

  const skip: Pick<FindManyArgs, 'skip'> | undefined = cursor ? { skip: 1 } : undefined;

  const orderBy: Pick<FindManyArgs, 'orderBy'> = {
    orderBy: {
      ...(params.sort === 'budget' ? { budget: sortOrder } : undefined),
      ...(params.sort === 'release_date' ? { release_date: sortOrder } : undefined),
      ...(params.sort === 'revenue' ? { revenue: sortOrder } : undefined),
      ...(params.sort === 'runtime' ? { runtime: sortOrder } : undefined),
      ...(params.sort === 'title' ? { title: sortOrder } : undefined),
    },
  };

  // TODO: profit, episode, and director sorting (might need to limit to just rewa)
  const [total, nextBatchTotal, matchedIds] = await Promise.all([
    prisma.movies.count({ ...where }),
    prisma.movies.count({ ...where, ...cursor }),
    prisma.movies.findMany({
      select: { id: true },
      take,
      ...where,
      ...cursor,
      ...skip,
      ...orderBy,
    }),
  ]);

  const data = await prisma.movies.findMany({
    ...orderBy,
    where: {
      id: { in: matchedIds.map(match => match.id) },
    },
    select: {
      budget: true,
      id: true,
      imdb_id: true,
      overview: true,
      poster_path: true,
      release_date: true,
      revenue: true, // NB: stored in DB as / 1000 due to BigInt shit
      runtime: true,
      title: true,
      tagline: true,
      actors_on_movies: {
        orderBy: { credit_order: 'asc' },
        select: { actors: selectIdAndName },
      },
      crew_on_movies: {
        where: { job: 'Director' },
        select: {
          job: true,
          crew: selectIdAndName,
        },
      },
      episodes: {
        take: 1,
        select: {
          id: true,
          spotify_url: true,
          episode_order: true,
          hosts_on_episodes: { select: { hosts: selectIdAndName } },
        },
      },
      genres_on_movies: {
        select: { genres: selectIdAndName },
      },
      streamers_on_movies: {
        select: { streamers: selectIdAndName },
      },
    },
  });

  const movies = data.map(movie => {
    return {
      ...pick(movie, [
        'id',
        'imdb_id',
        'overview',
        'poster_path',
        'release_date',
        'tagline',
        'title',
      ]),
      episode: movie.episodes[0]
        ? pick(movie.episodes[0], ['episode_order', 'id', 'spotify_url'])
        : null,
      actors: uniqBy(
        movie.actors_on_movies
          .filter(jt => jt.actors)
          .map(jt => jt.actors!)
          .map(item => tokenize('actor', item)),
        a => a.id
      ).slice(0, 3),
      budget: tokenizeBudget(movie.budget),
      directors: movie.crew_on_movies
        .filter(jt => jt.job === 'Director')
        .map(jt => jt.crew!)
        .map(item => tokenize('director', item)),
      genres: movie.genres_on_movies
        .filter(jt => jt.genres)
        .map(jt => jt.genres!)
        .map(item => tokenize('genre', item)),
      hosts: (movie.episodes[0]?.hosts_on_episodes || [])
        .filter(jt => jt.hosts)
        .map(jt => jt.hosts!)
        .map(item => tokenize('host', item)),
      revenue: tokenizeRevenue(movie.revenue),
      runtime: tokenizeRuntime(movie.runtime),
      streamers: movie.streamers_on_movies
        .filter(jt => jt.streamers)
        .map(jt => jt.streamers!)
        .map(item => tokenize('streamer', item)),
      year: tokenizeYear(movie.release_date),
    };
  });

  return {
    fresh: !params.movieCursor,
    movies,
    cursor: matchedIds[matchedIds.length - 1]?.id || 0,
    hasNext: nextBatchTotal - take > 0,
    total,
  };
};
