import { expressionBuilder } from 'kysely';
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

function yearMovies(year: string | number, comp: 'like' | '>=' | '<=') {
  const eb = expressionBuilder<KyselyDB, 'movies'>();
  return eb('movies.release_date', comp, comp == 'like' ? `${year}%` : String(year));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.time('querying');
  const params: QpSchema = {
    ...defaultQps,
    searchMode: 'and',
    // director: [6011],
    // producer: [591, 6011],
    // actor: [13408],
    // oscarsCategoriesNom: [5],
    // movie: [2937, 76],
    // yearLte: [1980],
  };

  let query = kyselyDb
    .selectFrom('movies')
    .select(['movies.id', 'movies.title'])
    .limit(100)
    .where(({ eb }) =>
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
        // revenue, runtime, budget
      ])
    );

  const response = await query.execute();
  console.timeEnd('querying');
  res.status(200).json(response);
}
