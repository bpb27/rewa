import { sql } from 'kysely';
import { QpSchema } from '~/data/query-params';
import { kyselyDb } from '../../prisma/kysley';
import { reusableSQL } from './reusable';

const { select, where } = reusableSQL;

export const getMovies = async (params: QpSchema) => {
  console.time('querying');
  const sortOrder = params.asc ? ('asc' as const) : ('desc' as const);
  const offset = 25 * params.page;

  const response = await kyselyDb
    .selectFrom('movies')
    .limit(25)
    .offset(offset)
    .select([
      'movies.id',
      'movies.title',
      'movies.budget',
      'movies.imdb_id',
      'movies.overview',
      'movies.poster_path',
      'movies.release_date',
      'movies.revenue',
      'movies.runtime',
      'movies.tagline',
      select.movieTotalOscarNominations(),
      select.movieTotalOscarWins(),
      select.movieKeywords(),
      select.movieGenres(),
      select.movieActors(3),
      select.movieEbertReview(),
      select.movieEpisode(),
      select.movieCrew(),
      select.movieStreamers(),
    ])
    .where(({ eb }) =>
      eb.and([
        ...(params.movieMode === 'rewa' ? [where.moviesWithAnyEpisode()] : []),
        ...(params.movieMode === 'oscar' ? [where.moviesWithAnyOscar()] : []),
        eb[params.searchMode]([
          ...(params.movie.length ? [eb('movies.id', 'in', params.movie)] : []),
          ...params.cinematographer.map(id => where.moviesWithCrew(id, 'cinematographer')),
          ...params.director.map(id => where.moviesWithCrew(id, 'director')),
          ...params.producer.map(id => where.moviesWithCrew(id, 'producer')),
          ...params.writer.map(id => where.moviesWithCrew(id, 'writer')),
          ...params.actor.map(id => where.moviesWithActor(id)),
          ...params.keyword.map(id => where.moviesWithKeyword(id)),
          ...params.streamer.map(id => where.moviesWithStreamer(id)),
          ...params.host.map(id => where.moviesWithHost(id)),
          ...params.oscarsCategoriesNom.map(id => where.moviesWithOscar(id)),
          ...params.oscarsCategoriesWon.map(id => where.moviesWithOscar(id, true)),
          ...params.year.map(id => where.moviesWithYear(id, 'like')),
          ...params.yearGte.map(id => where.moviesWithYear(id, '>=')),
          ...params.yearLte.map(id => where.moviesWithYear(id, '<=')),
          ...params.runtime.map(id => where.moviesWithRuntime(id, '~')),
          ...params.runtimeGte.map(id => where.moviesWithRuntime(id, '>=')),
          ...params.runtimeLte.map(id => where.moviesWithRuntime(id, '<=')),
          ...params.budget.map(id => where.moviesWithBudget(id, '~')),
          ...params.budgetGte.map(id => where.moviesWithBudget(id, '>=')),
          ...params.budgetLte.map(id => where.moviesWithBudget(id, '<=')),
          ...params.revenue.map(id => where.moviesWithRevenue(id, '~')),
          ...params.revenueGte.map(id => where.moviesWithRevenue(id, '>=')),
          ...params.revenueLte.map(id => where.moviesWithRevenue(id, '<=')),
        ]),
      ])
    )
    .$if(true, qb => {
      switch (params.sort) {
        case 'budget':
        case 'revenue':
        case 'release_date':
        case 'runtime':
        case 'title':
          return qb.orderBy(`movies.${params.sort}`, sortOrder);
        case 'episodeNumber':
          return qb
            .leftJoin('episodes as e', 'e.movie_id', 'movies.id')
            .orderBy('e.episode_order', sortOrder);
        case 'ebert':
          return qb
            .leftJoin('ebert_reviews as er', 'er.movie_id', 'movies.id')
            .orderBy('er.rating', sortOrder);
        case 'total_oscar_nominations':
          return qb.orderBy('total_oscar_nominations', sortOrder);
        case 'total_oscar_wins':
          return qb.orderBy('total_oscar_wins', sortOrder);
        case 'profit':
          return qb.orderBy(
            eb =>
              eb
                .case()
                .when('movies.budget', '=', 0)
                .then(0)
                .when('movies.budget', '>', 0)
                .then(sql<number>`ROUND(((revenue * 1000 - budget) / budget) * 100, 0)`)
                .end(),
            sortOrder
          );
        default:
          const exhaustiveCheck: never = params.sort;
          throw new Error(`Unhandled sort case: ${exhaustiveCheck}`);
      }
    })
    .execute();

  console.timeEnd('querying');

  return response;
};
