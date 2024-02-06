import { Prisma as PrismaBaseType } from '@prisma/client';
import { pick, uniqBy } from 'remeda';
import { crewJobs } from '~/data/crew-jobs';
import { movieFilters } from '~/data/movie-search-conditions';
import { QpSchema } from '~/data/query-params';
import {
  Token,
  tokenize,
  tokenizeBudget,
  tokenizeRevenue,
  tokenizeRuntime,
  tokenizeYear,
} from '~/data/tokens';
import { Prisma } from '~/prisma';
import { AppEnums } from '~/utils/enums';
import { getYear } from '~/utils/format';
import { sortCrew } from '~/utils/sorting';

// NB: searchMode AND === all conditions present, searchMode OR === any conditions present
// NB: using a view (movies_with_computed_fields) to sort across tables (e.g. episode order) + custom fields (e.g. profit percentage)

type OrderByKey = keyof PrismaBaseType.movies_with_computed_fieldsOrderByWithAggregationInput;

const prisma = Prisma.getPrisma();
const selectIdAndName = { select: { id: true, name: true } };

const sortMap = {
  budget: 'budget',
  director: 'director_name',
  ebert: 'ebert_rating',
  episodeNumber: 'episode_order',
  profit: 'profit_percentage',
  release_date: 'release_date',
  revenue: 'revenue',
  runtime: 'runtime',
  title: 'title',
  total_oscar_nominations: 'total_oscar_nominations',
  total_oscar_wins: 'total_oscar_wins',
} satisfies Record<AppEnums['sort'], OrderByKey>;

export const getMovies = async (params: QpSchema) => {
  const take = 25;
  const sort = sortMap[params.sort];
  const order = params.asc ? 'asc' : 'desc';
  const offset = params.page * take;
  const where = movieFilters(params);

  // can do more includes to tighten up - only 25 records + being parsed below
  const [total, data] = await Promise.all([
    prisma.movies.count({ where }),
    prisma.movies_with_computed_fields.findMany({
      where: { movie: where },
      orderBy: { [sort]: order },
      take,
      skip: offset,
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
              select: { actors: { select: { id: true, name: true, profile_path: true } } },
            },
            crew_on_movies: {
              where: {
                job: {
                  in: Object.values(crewJobs).flat(),
                },
              },
              select: {
                job: true,
                crew: selectIdAndName,
              },
            },
            ebert_reviews: true,
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
            keywords_on_movies: {
              select: { keywords: selectIdAndName },
            },
            oscars_nominations: {
              select: {
                recipient: true,
                won: true,
                ceremony_year: true,
                award: { select: { oscars_categories: selectIdAndName } },
              },
            },
            streamers_on_movies: {
              select: { streamers: selectIdAndName },
            },
          },
        },
        total_oscar_nominations: true,
        total_oscar_wins: true,
      },
    }),
  ]);

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
      actors: uniqBy(
        movie.actors_on_movies
          .filter(jt => jt.actors)
          .map(jt => jt.actors!)
          .map(item => ({ ...tokenize('actor', item), profile_path: item.profile_path })),
        a => a.id
      ).slice(0, 3),
      budget: tokenizeBudget(movie.budget),
      crew: movie.crew_on_movies
        .filter(jt => jt.crew)
        .map(({ crew, job }) => {
          if (crewJobs.director.includes(job)) {
            return tokenize('director', crew);
          } else if (crewJobs.producer.includes(job)) {
            return tokenize('producer', crew);
          } else if (crewJobs.cinematographer.includes(job)) {
            return tokenize('cinematographer', crew);
          } else if (crewJobs.writer.includes(job)) {
            return tokenize('writer', crew);
          }
        })
        .filter(item => item)
        .map(item => item as Token)
        .sort(sortCrew),
      directors: movie.crew_on_movies
        .filter(jt => jt.job === 'Director')
        .map(jt => jt.crew!)
        .map(item => tokenize('director', item)),
      ebertReview: movie.ebert_reviews,
      episode: movie.episodes[0]
        ? pick(movie.episodes[0], ['episode_order', 'id', 'spotify_url'])
        : null,
      genres: movie.genres_on_movies
        .filter(jt => jt.genres)
        .map(jt => jt.genres!)
        .map(item => tokenize('genre', item)),
      hosts: (movie.episodes[0]?.hosts_on_episodes || [])
        .filter(jt => jt.hosts)
        .map(jt => jt.hosts!)
        .map(item => tokenize('host', item)),
      keywords: movie.keywords_on_movies
        .filter(jt => jt.keywords)
        .map(jt => jt.keywords!)
        .map(item => tokenize('keyword', item)),
      revenue: tokenizeRevenue(movie.revenue),
      runtime: tokenizeRuntime(movie.runtime),
      streamers: movie.streamers_on_movies
        .filter(jt => jt.streamers)
        .map(jt => jt.streamers!)
        .map(item => tokenize('streamer', item)),
      oscars: {
        noms: item.total_oscar_nominations,
        wins: item.total_oscar_wins,
        year: movie.oscars_nominations[0]?.ceremony_year || Number(getYear(movie.release_date)),
        awards: movie.oscars_nominations.map(on => ({
          awardCategory: on.award.oscars_categories.name,
          awardCategoryId: on.award.oscars_categories.id,
          recipient: on.recipient,
          won: on.won,
        })),
      },
      year: tokenizeYear(movie.release_date),
    };
  });

  return {
    hasNext: offset + take < total,
    results: movies,
    page: params.page,
    total,
  };
};
