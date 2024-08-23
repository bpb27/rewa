import { sql } from 'kysely';
import { jobIdToJobStr } from '~/data/crew-jobs';
import { QpSchema } from '~/data/query-params';
import { newFormatDate } from '~/utils/format';
import { kyselyDb } from '../../pg/db';
import { allMovieFilters, reusableSQL } from './reusable';

const { select } = reusableSQL;

export const getMovies = async (params: QpSchema) => {
  const sortOrder = params.asc ? ('asc' as const) : ('desc' as const);
  const limit = 25;
  const offset = limit * params.page;

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
      sql`round(movies.revenue, 0)`.as('revenue'),
      'movies.runtime',
      'movies.tagline',
      select.movieActors(3),
      select.movieCrew(),
      select.movieEbertReview(),
      select.movieEpisode(),
      select.movieGenres(),
      select.movieKeywords(),
      select.movieStreamers(),
      select.movieTotalOscarNominations(),
      select.movieTotalOscarWins(),
      select.movieOscars(),
    ])
    .where(allMovieFilters(params))
    .$if(true, qb => {
      switch (params.sort) {
        case 'budget':
        case 'revenue':
        case 'release_date':
        case 'runtime':
        case 'popularity':
        case 'title':
          return qb.orderBy(`movies.${params.sort}`, sortOrder);
        case 'episodeNumber':
          return qb
            .leftJoin('episodes as e', 'e.movie_id', 'movies.id')
            .orderBy('e.episode_order', sortOrder);
        case 'ebert':
          return qb
            .innerJoin('ebert_reviews as er', 'er.movie_id', 'movies.id')
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
                .when('movies.budget', '=', '0')
                .then(0)
                .when('movies.budget', '>', '0')
                .then(sql`ROUND(((revenue * 1000 - budget) / budget) * 100, 0)`)
                .end(),
            sortOrder
          );
        default:
          const exhaustiveCheck: never = params.sort;
          throw new Error(`Unhandled sort case: ${exhaustiveCheck}`);
      }
    })
    .orderBy('title', 'asc') // additional order by to ensure offset works on ties
    .execute();

  const count = await kyselyDb
    .selectFrom('movies')
    .select(eb => eb.fn.count('movies.id').as('total'))
    .$if(params.sort === 'ebert', qb =>
      qb.innerJoin('ebert_reviews as er', 'er.movie_id', 'movies.id')
    )
    .where(allMovieFilters(params))
    .executeTakeFirst();

  const results = response.map(movie => ({
    actors: movie.actors,
    budget: Number(movie.budget),
    crew: movie.crew.map(c => ({ ...c, job: jobIdToJobStr[c.job_id] })),
    ebert: movie.ebert_review,
    episode: movie.episode,
    id: movie.id,
    image: movie.poster_path,
    imdbId: movie.imdb_id,
    keywords: movie.keywords.map(k => ({ id: k.id, name: k.name })),
    name: movie.title,
    oscars: movie.oscars,
    totalOscarNominations: Number(movie.total_oscar_nominations) || 0,
    totalOscarWins: Number(movie.total_oscar_wins) || 0,
    description: movie.overview,
    releaseDate: newFormatDate(movie.release_date, 'dash'),
    revenue: Number(movie.revenue),
    runtime: movie.runtime,
    streamers: movie.streamers,
    tagline: movie.tagline,
    year: newFormatDate(movie.release_date, 'year'),
  }));

  const total = Number(count?.total || 0);

  return {
    total,
    hasNext: offset + limit < total,
    page: params.page,
    results,
  };
};
