import { pick } from 'remeda';
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
import { smartSort, sortingUtils } from '~/utils/sorting';

/*
  NB can't sort across tables w/ prisma + SQLite, so fetching and formatting all data before sorting and paginating
  NB: mode AND === all conditions present, mode OR === any conditions present
*/

const prisma = Prisma.getPrisma();
const selectIdAndName = { select: { id: true, name: true } };

export type GetMoviesResponse = Awaited<ReturnType<typeof getMovies>>;

export const getMovies = async (params: QpSchema) => {
  const mode = params.mode.toUpperCase() as 'AND' | 'OR';
  const searches = getSearches(params);
  const prismaSearch = searches.length ? { [mode]: createFilters(mode, searches) } : undefined;

  const data = await prisma.movies.findMany({
    where: {
      episodes: { some: {} },
      ...prismaSearch,
    },
    select: {
      budget: true,
      id: true,
      imdb_id: true,
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

  const movies = smartSort(
    data.map(movie => {
      const episode = movie.episodes[0];

      const actors = movie.actors_on_movies
        .filter(jt => jt.actors)
        .map(jt => jt.actors!)
        .map(item => tokenize('actor', item));

      const hosts = episode.hosts_on_episodes
        .filter(jt => jt.hosts)
        .map(jt => jt.hosts!)
        .map(item => tokenize('host', item));

      const directors = movie.crew_on_movies
        .filter(jt => jt.job === 'Director')
        .map(jt => jt.crew!)
        .map(item => tokenize('director', item));

      const genres = movie.genres_on_movies
        .filter(jt => jt.genres)
        .map(jt => jt.genres!)
        .map(item => tokenize('genre', item));

      const streamers = movie.streamers_on_movies
        .filter(jt => jt.streamers)
        .map(jt => jt.streamers!)
        .map(item => tokenize('streamer', item));

      return {
        ...pick(movie, ['id', 'imdb_id', 'poster_path', 'release_date', 'tagline', 'title']),
        episode: pick(episode, ['episode_order', 'id', 'spotify_url']),
        actors: actors.slice(0, 3),
        budget: tokenizeBudget(movie.budget),
        directors,
        genres,
        hosts,
        revenue: tokenizeRevenue(movie.revenue),
        runtime: tokenizeRuntime(movie.runtime),
        streamers,
        year: tokenizeYear(movie.release_date),
      };
    }),
    sortingUtils.fns[params.sort],
    params.asc
  ).slice(0, params.amount);

  return {
    movies,
    total: data.length,
  };
};
