import { sql } from 'kysely';
import { z } from 'zod';
import { relevantCrewIds } from '~/data/crew-jobs';
import {
  tokenize,
  tokenizeCrew,
  tokenizeYear,
  tokenizeYearGte,
  tokenizeYearLte,
} from '~/data/tokens';
import { appEnums } from '~/utils/enums';
import { newFormatDate } from '~/utils/format';
import { isInteger, isYear } from '~/utils/validate';
import { kyselyDb } from '../../pg/db';
import { reusableSQL } from './reusable';

export const searchTokensParams = z.object({
  filter: appEnums.movieMode.schema,
  search: z.string(),
});

export const searchTokens = async (params: z.infer<typeof searchTokensParams>) => {
  const search = `%${params.search.toLowerCase()}%`;
  const movieMode = reusableSQL.where.movieMode(params.filter);
  const [movies, actors, crew, hosts, keywords, genres, streamers] = await Promise.all([
    kyselyDb
      .selectFrom('movies')
      .select(['id', 'title as name', 'release_date'])
      .where('title', 'ilike', search)
      .where(movieMode)
      .orderBy(
        eb => eb.case().when(sql.raw('lower(title)'), '=', params.search).then(0).else(1).end(),
        'asc'
      )
      .orderBy('release_date desc')
      .limit(3)
      .execute(),
    kyselyDb
      .selectFrom('actors_on_movies')
      .innerJoin('actors', 'actors.id', 'actors_on_movies.actor_id')
      .innerJoin('movies', 'movies.id', 'actors_on_movies.movie_id')
      .select(['actors.id', 'actors.name'])
      .where('actors.name', 'ilike', search)
      .where(movieMode)
      .groupBy('actors.id')
      .orderBy('actors.popularity desc')
      .limit(3)
      .execute(),
    kyselyDb
      .selectFrom('crew_on_movies')
      .innerJoin('crew', 'crew.id', 'crew_on_movies.crew_id')
      .innerJoin('movies', 'movies.id', 'crew_on_movies.movie_id')
      .select(['crew.id', 'crew.name', 'crew_on_movies.job_id'])
      .where('crew_on_movies.job_id', 'in', relevantCrewIds)
      .where('crew.name', 'ilike', search)
      .where(movieMode)
      .groupBy(['crew.id', 'crew_on_movies.job_id']) // TODO: verify
      .orderBy('crew.popularity desc')
      .limit(3)
      .execute(),
    kyselyDb
      .selectFrom('hosts')
      .innerJoin('hosts_on_episodes as jt', 'jt.host_id', 'hosts.id')
      .select(['hosts.id', 'hosts.name', eb => eb.fn.count('jt.episode_id').as('count')])
      .where('hosts.name', 'ilike', search)
      .groupBy('hosts.id')
      .orderBy('count desc')
      .limit(3)
      .execute(),
    kyselyDb
      .selectFrom('keywords_on_movies')
      .innerJoin('keywords', 'keywords.id', 'keywords_on_movies.id')
      .innerJoin('movies', 'movies.id', 'keywords_on_movies.movie_id')
      .select([
        'keywords.id',
        'keywords.name',
        eb => eb.fn.count('keywords_on_movies.movie_id').as('count'),
      ])
      .where('keywords.name', 'ilike', search)
      .where(movieMode)
      .groupBy('keywords.id')
      .orderBy('count desc')
      .limit(3)
      .execute(),
    kyselyDb
      .selectFrom('genres_on_movies')
      .innerJoin('genres', 'genres.id', 'genres_on_movies.id')
      .innerJoin('movies', 'movies.id', 'genres_on_movies.movie_id')
      .select([
        'genres.id',
        'genres.name',
        eb => eb.fn.count('genres_on_movies.movie_id').as('count'),
      ])
      .where('genres.name', 'ilike', search)
      .where(movieMode)
      .groupBy('genres.id')
      .orderBy('count desc')
      .limit(3)
      .execute(),
    kyselyDb
      .selectFrom('streamers')
      .leftJoin('streamers_on_movies', 'streamers_on_movies.streamer_id', 'streamers.id')
      .select([
        'streamers.id',
        'streamers.name',
        eb => eb.fn.count('streamers_on_movies.movie_id').as('count'),
      ])
      .where('streamers.name', 'ilike', search)
      .groupBy('streamers.id')
      .orderBy('count desc')
      .limit(3)
      .execute(),
  ]);

  const results = [
    ...movies.map(t =>
      tokenize('movie', { id: t.id, name: `${t.name} (${newFormatDate(t.release_date, 'year')})` })
    ),
    ...actors.map(t => tokenize('actor', t)),
    ...crew.map(tokenizeCrew),
    ...hosts.map(t => tokenize('host', t)),
    ...keywords.map(t => tokenize('keyword', t)),
    ...genres.map(t => tokenize('genre', t)),
    ...streamers.map(t => tokenize('streamer', t)),
  ];

  if (isInteger(params.search) && pickYear(params.search)) {
    const year = pickYear(params.search);
    results.push(tokenizeYear(year));
    results.push(tokenizeYearGte(year));
    results.push(tokenizeYearLte(year));
  }

  return results;
};

const pickYear = (str: string) => {
  if (isYear(str)) {
    return str;
  } else if (str === '1' || str === '19') {
    return '1999';
  } else if (str === '2' || str === '20') {
    return '2000';
  } else if (str.length === 3 && !!(str.startsWith('19') || str.startsWith('20'))) {
    return str + '0';
  } else {
    return '';
  }
};
