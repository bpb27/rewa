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
      .where(movieMode)
      .where(sql.raw('lower(title)'), 'like', search)
      .orderBy(
        eb => eb.case().when(sql.raw('lower(title)'), '=', params.search).then(0).else(1).end(),
        'asc'
      )
      .orderBy('release_date desc')
      .limit(3)
      .execute(),
    // TODO: movie mode (won't work as is, needs movies table)
    kyselyDb
      .selectFrom('actors')
      .leftJoin('actors_on_oscars as jt', 'jt.actor_id', 'actors.id')
      .select(['actors.id', 'actors.name', eb => eb.fn.count('jt.actor_id').as('count')])
      .where(sql.raw('lower(name)'), 'like', search)
      .groupBy('actors.id')
      .orderBy('count desc')
      .limit(3)
      .execute(),
    // TODO: movie mode (won't work as is, needs movies table)
    kyselyDb
      .selectFrom('crew')
      .innerJoin('crew_on_movies as jt', 'jt.crew_id', 'crew.id')
      .select(['crew.id', 'crew.name', 'jt.job_id', eb => eb.fn.count('jt.crew_id').as('count')])
      .where('jt.job_id', 'in', relevantCrewIds)
      .where(sql.raw('lower(name)'), 'like', search)
      .groupBy('crew.id')
      .orderBy('count desc')
      .limit(3)
      .execute(),
    kyselyDb
      .selectFrom('hosts')
      .innerJoin('hosts_on_episodes as jt', 'jt.host_id', 'hosts.id')
      .select(['hosts.id', 'hosts.name', eb => eb.fn.count('jt.episode_id').as('count')])
      .where(sql.raw('lower(name)'), 'like', search)
      .groupBy('hosts.id')
      .orderBy('count desc')
      .limit(3)
      .execute(),
    kyselyDb
      .selectFrom('keywords')
      .innerJoin('keywords_on_movies as jt', 'jt.keyword_id', 'keywords.id')
      .select(['keywords.id', 'keywords.name', eb => eb.fn.count('jt.movie_id').as('count')])
      .where(sql.raw('lower(name)'), 'like', search)
      .groupBy('keywords.id')
      .orderBy('count desc')
      .limit(3)
      .execute(),
    kyselyDb
      .selectFrom('streamers')
      .select(['streamers.id', 'streamers.name'])
      .where('name', 'in', relevantStreamers)
      .where(sql.raw('lower(name)'), 'like', search)
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

  if (isInteger(search) && pickYear(search)) {
    const year = pickYear(search);
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
