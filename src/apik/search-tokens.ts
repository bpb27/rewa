import { sql } from 'kysely';
import { z } from 'zod';
import { relevantCrewIds } from '~/data/crew-jobs';
import { relevantStreamers } from '~/data/streamers';
import {
  tokenize,
  tokenizeCrew,
  tokenizeYear,
  tokenizeYearGte,
  tokenizeYearLte,
} from '~/data/tokens';
import { appEnums } from '~/utils/enums';
import { getYear } from '~/utils/format';
import { isInteger, isYear } from '~/utils/validate';
import { kyselyDb } from '../../prisma/kysley';
import { reusableSQL } from './reusable';

export const searchTokensParams = z.object({
  filter: appEnums.movieMode.schema,
  search: z.string(),
});

export const searchTokens = async (params: z.infer<typeof searchTokensParams>) => {
  const search = `%${params.search.toLowerCase()}%`;
  const movieMode = reusableSQL.where.movieMode(params.filter);
  const [movies, actors, crew, hosts, keywords, streamers] = await Promise.all([
    kyselyDb
      .selectFrom('movies')
      .select(['id', 'title as name', 'release_date'])
      .where(sql.raw('lower(title)'), 'like', search)
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
      .select([
        'actors.id',
        'actors.name',
        eb => eb.fn.count('actors_on_movies.actor_id').as('count'),
      ])
      .where(sql.raw('lower(actors.name)'), 'like', search)
      .where(movieMode)
      .groupBy('actors.id')
      .orderBy('count desc')
      .limit(3)
      .execute(),
    kyselyDb
      .selectFrom('crew_on_movies')
      .innerJoin('crew', 'crew.id', 'crew_on_movies.crew_id')
      .innerJoin('movies', 'movies.id', 'crew_on_movies.movie_id')
      .select([
        'crew.id',
        'crew.name',
        'crew_on_movies.job_id',
        eb => eb.fn.count('crew_on_movies.crew_id').as('count'),
      ])
      .where('crew_on_movies.job_id', 'in', relevantCrewIds)
      .where(sql.raw('lower(crew.name)'), 'like', search)
      .where(movieMode)
      .groupBy('crew.id')
      .orderBy('count desc')
      .limit(3)
      .execute(),
    kyselyDb
      .selectFrom('hosts')
      .innerJoin('hosts_on_episodes as jt', 'jt.host_id', 'hosts.id')
      .select(['hosts.id', 'hosts.name', eb => eb.fn.count('jt.episode_id').as('count')])
      .where(sql.raw('lower(hosts.name)'), 'like', search)
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
      .where(sql.raw('lower(keywords.name)'), 'like', search)
      .where(movieMode)
      .groupBy('keywords.id')
      .orderBy(
        eb => eb.case().when(sql.raw('lower(title)'), '=', params.search).then(0).else(1).end(),
        'asc'
      )
      .orderBy('count desc')
      .limit(3)
      .execute(),
    kyselyDb
      .selectFrom('streamers')
      .select(['streamers.id', 'streamers.name'])
      .where('name', 'in', relevantStreamers)
      .where(sql.raw('lower(streamers.name)'), 'like', search)
      .limit(3)
      .execute(),
  ]);

  const results = [
    ...movies.map(t =>
      tokenize('movie', { id: t.id, name: `${t.name} (${getYear(t.release_date)})` })
    ),
    ...actors.map(t => tokenize('actor', t)),
    ...crew.map(tokenizeCrew),
    ...hosts.map(t => tokenize('host', t)),
    ...keywords.map(t => tokenize('keyword', t)),
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
