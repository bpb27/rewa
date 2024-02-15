import { expressionBuilder } from 'kysely';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/sqlite';
import type { NextApiRequest, NextApiResponse } from 'next';
import { crewJobs } from '~/data/crew-jobs';
import { QpSchema, defaultQps } from '~/data/query-params';
import { kyselyDb, type KyselyDB } from '../../../prisma/kysley';

function crewMovies(crewId: number, crewKey: keyof typeof crewJobs) {
  const eb = expressionBuilder<KyselyDB, 'movies'>();
  return eb('movies.id', 'in', ({ selectFrom }) =>
    selectFrom('crew_on_movies as jt')
      .select(['jt.movie_id'])
      .where('jt.crew_id', '=', crewId)
      .where('jt.job', 'in', crewJobs[crewKey])
      .where('jt.movie_id', 'is not', null)
  );
}

function actorMovies(actorId: number) {
  const eb = expressionBuilder<KyselyDB, 'movies'>();
  return eb('movies.id', 'in', ({ selectFrom }) =>
    selectFrom('actors_on_movies as jt')
      .select(['jt.movie_id'])
      .where('jt.actor_id', '=', actorId)
      .where('jt.movie_id', 'is not', null)
  );
}

function keywordMovies(keywordId: number) {
  const eb = expressionBuilder<KyselyDB, 'movies'>();
  return eb('movies.id', 'in', ({ selectFrom }) =>
    selectFrom('keywords_on_movies as jt')
      .select(['jt.movie_id'])
      .where('jt.keyword_id', '=', keywordId)
      .where('jt.movie_id', 'is not', null)
  );
}

function streamerMovies(streamerId: number) {
  const eb = expressionBuilder<KyselyDB, 'movies'>();
  return eb('movies.id', 'in', ({ selectFrom }) =>
    selectFrom('streamers_on_movies as jt')
      .select(['jt.movie_id'])
      .where('jt.streamer_id', '=', streamerId)
      .where('jt.movie_id', 'is not', null)
  );
}

function hostMovies(hostId: number) {
  const eb = expressionBuilder<KyselyDB, 'movies'>();
  return eb('movies.id', 'in', ({ selectFrom }) =>
    selectFrom('episodes as e')
      .innerJoin('hosts_on_episodes as jt', 'jt.episode_id', 'e.id')
      .select(['e.movie_id'])
      .where('jt.host_id', '=', hostId)
      .where('e.movie_id', 'is not', null)
  );
}

function oscarMovies(categoryId: number, won?: boolean) {
  const eb = expressionBuilder<KyselyDB, 'movies'>();
  return eb('movies.id', 'in', ({ selectFrom }) => {
    let ex = selectFrom('oscars_nominations as nom')
      .innerJoin('oscars_awards as aw', 'aw.id', 'nom.award_id')
      .select(['nom.movie_id'])
      .where('aw.category_id', '=', categoryId)
      .where('nom.movie_id', 'is not', null);
    if (won) ex = ex.where('nom.won', '=', 1);
    return ex;
  });
}

function hasOscarMovies() {
  const eb = expressionBuilder<KyselyDB, 'movies'>();
  return eb('movies.id', 'in', ({ selectFrom }) => {
    return selectFrom('oscars_nominations as nom')
      .select(['nom.movie_id'])
      .where('nom.movie_id', 'is not', null);
  });
}

function hasRewaMovies() {
  const eb = expressionBuilder<KyselyDB, 'movies'>();
  return eb('movies.id', 'in', ({ selectFrom }) => {
    return selectFrom('episodes as e').select(['e.movie_id']).where('e.movie_id', 'is not', null);
  });
}

function yearMovies(year: string | number, comp: 'like' | '>=' | '<=') {
  const eb = expressionBuilder<KyselyDB, 'movies'>();
  return eb('movies.release_date', comp, comp == 'like' ? `${year}%` : String(year));
}

function runtimeMovies(runtime: number, comp: '~' | '>=' | '<=') {
  const eb = expressionBuilder<KyselyDB, 'movies'>();
  if (comp === '~') {
    return eb.and([
      eb('movies.runtime', '<=', runtime + 5),
      eb('movies.runtime', '>=', runtime - 5),
    ]);
  } else {
    return eb('movies.runtime', comp, runtime);
  }
}

// TODO: pretty sure this is off
// TODO: scalar, e.g. 10k should be +-5k, b but 1b should be +-250b
function budgetMovies(budget: number, comp: '~' | '>=' | '<=') {
  const eb = expressionBuilder<KyselyDB, 'movies'>();
  if (comp === '~') {
    return eb.and([
      eb('movies.budget', '<=', budget + 5000000),
      eb('movies.budget', '>=', budget - 5000000),
    ]);
  } else {
    return eb('movies.budget', comp, budget);
  }
}

// TODO: scalar, e.g. 10k should be +-5k, b but 1b should be +-250b
function revenueMovies(revenue: number, comp: '~' | '>=' | '<=') {
  const eb = expressionBuilder<KyselyDB, 'movies'>();
  if (comp === '~') {
    return eb.and([
      eb('movies.revenue', '<=', revenue + 5000), // NB: Stored as / 1000 due to BigInt shit
      eb('movies.revenue', '>=', revenue - 5000), // NB: Stored as / 1000 due to BigInt shit
    ]);
  } else {
    return eb('movies.revenue', comp, revenue);
  }
}

const selectMovieGenres = () => {
  const eb = expressionBuilder<KyselyDB, 'movies'>();
  return jsonArrayFrom(
    eb
      .selectFrom('genres_on_movies as jt')
      .leftJoin('genres', 'genres.id', 'jt.genre_id')
      .select(['genres.id', 'genres.name'])
      .whereRef('jt.movie_id', '=', 'movies.id')
  ).as('genres');
};

const selectMovieActors = (limit: number) => {
  const eb = expressionBuilder<KyselyDB, 'movies'>();
  return jsonArrayFrom(
    eb
      .selectFrom('actors_on_movies as jt')
      .leftJoin('actors', 'actors.id', 'jt.actor_id')
      .select(['actors.id', 'actors.name', 'actors.profile_path'])
      .whereRef('jt.movie_id', '=', 'movies.id')
      .orderBy('jt.credit_id asc')
      .limit(limit)
  ).as('actors');
};

const selectMovieKeywords = () => {
  const eb = expressionBuilder<KyselyDB, 'movies'>();
  return jsonArrayFrom(
    eb
      .selectFrom('keywords_on_movies as jt')
      .leftJoin('keywords', 'keywords.id', 'jt.keyword_id')
      .select(['keywords.id', 'keywords.name'])
      .whereRef('jt.movie_id', '=', 'movies.id')
  ).as('keywords');
};

const selectMovieEbertReview = () => {
  const eb = expressionBuilder<KyselyDB, 'movies'>();
  return jsonObjectFrom(
    eb
      .selectFrom('ebert_reviews as er')
      .select(['er.path', 'er.rating'])
      .whereRef('er.movie_id', '=', 'movies.id')
  ).as('ebert_review');
};

const selectMovieEpisode = () => {
  const eb = expressionBuilder<KyselyDB, 'movies'>();
  return jsonObjectFrom(
    eb
      .selectFrom('episodes as e')
      .select(['e.spotify_url'])
      .whereRef('e.movie_id', '=', 'movies.id')
  ).as('episode');
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.time('querying');
  const params: QpSchema = {
    ...defaultQps,
    searchMode: 'and',
    movieMode: 'rewa',
    // director: [6011],
    // producer: [591, 6011],
    // actor: [13408],
    // oscarsCategoriesWon: [5],
    // movie: [2937, 76],
    // yearGte: [1980],
  };

  const response = await kyselyDb
    .selectFrom('movies')
    .leftJoin('movies_with_computed_fields as movies_view', 'movies_view.movie_id', 'movies.id')
    .orderBy('movies_view.release_date desc')
    .limit(25)
    .select([
      'movies.budget',
      'movies.id',
      'movies.imdb_id',
      'movies.overview',
      'movies.poster_path',
      'movies.release_date',
      'movies.revenue',
      'movies.runtime',
      'movies.title',
      'movies.tagline',
      'movies_view.total_oscar_nominations',
      'movies_view.total_oscar_wins',
      selectMovieKeywords(),
      selectMovieGenres(),
      selectMovieActors(3),
      selectMovieEbertReview(),
      selectMovieEpisode(),
      // crew, oscars, streamers
    ])
    .where(({ eb }) =>
      eb.and([
        ...(params.movieMode === 'rewa' ? [hasRewaMovies()] : []),
        ...(params.movieMode === 'oscar' ? [hasOscarMovies()] : []),
        eb[params.searchMode]([
          ...(params.movie.length ? [eb('movies.id', 'in', params.movie)] : []),
          ...params.cinematographer.map(id => crewMovies(id, 'cinematographer')),
          ...params.director.map(id => crewMovies(id, 'director')),
          ...params.producer.map(id => crewMovies(id, 'producer')),
          ...params.writer.map(id => crewMovies(id, 'writer')),
          ...params.actor.map(actorMovies),
          ...params.keyword.map(keywordMovies),
          ...params.streamer.map(streamerMovies),
          ...params.host.map(hostMovies),
          ...params.oscarsCategoriesNom.map(id => oscarMovies(id)),
          ...params.oscarsCategoriesWon.map(id => oscarMovies(id, true)),
          ...params.year.map(id => yearMovies(id, 'like')),
          ...params.yearGte.map(id => yearMovies(id, '>=')),
          ...params.yearLte.map(id => yearMovies(id, '<=')),
          ...params.runtime.map(id => runtimeMovies(id, '~')),
          ...params.runtimeGte.map(id => runtimeMovies(id, '>=')),
          ...params.runtimeLte.map(id => runtimeMovies(id, '<=')),
          ...params.budget.map(id => budgetMovies(id, '~')),
          ...params.budgetGte.map(id => budgetMovies(id, '>=')),
          ...params.budgetLte.map(id => budgetMovies(id, '<=')),
          ...params.revenue.map(id => revenueMovies(id, '~')),
          ...params.revenueGte.map(id => revenueMovies(id, '>=')),
          ...params.revenueLte.map(id => revenueMovies(id, '<=')),
        ]),
      ])
    )
    .execute();

  console.timeEnd('querying');
  res.status(200).json(response);
}
