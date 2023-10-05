import { pick, uniqBy } from 'remeda';
import { createFilters, getSearches } from '~/data/movie-search-conditions';
import { QpSchema, SortKey } from '~/data/query-params';
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
// NB: using a view (movies_with_computed_fields) to sort across tables (e.g. episode order) + custom fields (e.g. profit percentage)

type QueryWhere = Pick<PrismaBaseType.moviesFindManyArgs, 'where'>;
type QueryOrderBy = Pick<PrismaBaseType.movies_with_computed_fieldsFindManyArgs, 'orderBy'>;
type QuerySkip = Pick<PrismaBaseType.movies_with_computed_fieldsFindManyArgs, 'skip'>;
type OrderByKey = keyof PrismaBaseType.movies_with_computed_fieldsOrderByWithAggregationInput;

const prisma = Prisma.getPrisma();
const selectIdAndName = { select: { id: true, name: true } };
const take = 25;

const sortMap = {
  budget: 'budget',
  director: 'director_name',
  episodeNumber: 'episode_order',
  profit: 'profit_percentage',
  release_date: 'release_date',
  revenue: 'revenue',
  runtime: 'runtime',
  title: 'title',
  total_oscar_nominations: 'total_oscar_nominations',
  total_oscar_wins: 'total_oscar_wins',
} satisfies Record<SortKey, OrderByKey>;

export type GetMoviesParams = QpSchema;
export type GetMoviesResponse = Awaited<ReturnType<typeof getMovies>>;

export const getMovies = async (params: GetMoviesParams) => {
  const mode = params.mode.toUpperCase() as 'AND' | 'OR';
  const sortOrder = params.asc ? 'asc' : 'desc';
  const offset = params.page * take;
  const searches = getSearches(params);
  const prismaSearch = searches.length ? { [mode]: createFilters(mode, searches) } : undefined;

  const where: QueryWhere = {
    where: {
      ...(params.hasEpisode ? { episodes: { some: {} } } : undefined),
      ...(params.hasOscar ? { oscars_nominations: { some: {} } } : undefined),
      ...prismaSearch,
    },
  };

  const orderBy: QueryOrderBy = {
    orderBy: { [sortMap[params.sort]]: sortOrder },
  };

  const skip: QuerySkip = {
    skip: offset,
  };

  const [total, matchedIds] = await Promise.all([
    prisma.movies.count({ ...where }),
    prisma.movies_with_computed_fields.findMany({
      select: { movie_id: true },
      where: { movie: where.where },
      take,
      ...skip,
      ...orderBy,
    }),
  ]);

  const data = await prisma.movies_with_computed_fields.findMany({
    ...orderBy,
    where: {
      movie_id: { in: matchedIds.map(match => match.movie_id) },
    },
    select: {
      movie: {
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
          oscars_nominations: {
            select: {
              id: true,
              recipient: true,
              won: true,
              ceremony_year: true,
              award: { select: { category: true, name: true } },
            },
          },
          streamers_on_movies: {
            select: { streamers: selectIdAndName },
          },
        },
      },
    },
  });

  const movies = data.map(item => {
    const movie = item.movie!;
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
      oscars: movie.oscars_nominations.map(o => ({
        id: o.id,
        award: o.award.name,
        awardCategory: o.award.category,
        won: o.won,
        recipient: o.recipient,
        ceremonyYear: o.ceremony_year,
      })),
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
    hasNext: offset + take < total,
    movies,
    page: params.page,
    total,
  };
};
