import { sql } from 'kysely';
import { QpSchema } from '~/data/query-params';
import { AppEnums, appEnums } from '~/utils/enums';
import { moneyShort, titleCase } from '~/utils/format';
import { kyselyDb } from '../../pg/db';

export const getTokens = async (params: QpSchema) => {
  const response: { type: AppEnums['token']; name: string; id: number }[][] = await Promise.all(
    appEnums.token.values.map(tokenType => {
      const ids = params[tokenType];
      if (!ids.length) return [];

      switch (tokenType) {
        case 'budget':
          return ids.map(id => ({ type: tokenType, id, name: moneyShort(id) }));
        case 'budgetLte':
          return ids.map(id => ({ type: tokenType, id, name: `<= ${moneyShort(id)}` }));
        case 'budgetGte':
          return ids.map(id => ({ type: tokenType, id, name: `>= ${moneyShort(id)}` }));
        case 'revenue':
          return ids.map(id => ({ type: tokenType, id, name: moneyShort(id) }));
        case 'revenueLte':
          return ids.map(id => ({ type: tokenType, id, name: `<= ${moneyShort(id)}` }));
        case 'revenueGte':
          return ids.map(id => ({ type: tokenType, id, name: `>= ${moneyShort(id)}` }));
        case 'runtime':
          return ids.map(id => ({ type: tokenType, id, name: `${id} mins` }));
        case 'runtimeLte':
          return ids.map(id => ({ type: tokenType, id, name: `<= ${id} mins` }));
        case 'runtimeGte':
          return ids.map(id => ({ type: tokenType, id, name: `>= ${id} mins` }));
        case 'year':
          return ids.map(id => ({ type: tokenType, id, name: id.toString() }));
        case 'yearLte':
          return ids.map(id => ({ type: tokenType, id, name: `<= ${id.toString()}` }));
        case 'yearGte':
          return ids.map(id => ({ type: tokenType, id, name: `>= ${id.toString()}` }));
        case 'actor':
          return kyselyDb
            .selectFrom('actors')
            .select(['id', 'name', sql.lit(tokenType).as('type')])
            .where('id', 'in', ids)
            .execute();
        case 'cinematographer':
        case 'composer':
        case 'director':
        case 'producer':
        case 'writer':
          return kyselyDb
            .selectFrom('crew')
            .select(['id', 'name', sql.lit(tokenType).as('type')])
            .where('id', 'in', ids)
            .execute();
        case 'genre':
          return kyselyDb
            .selectFrom('genres')
            .select(['id', 'name', sql.lit(tokenType).as('type')])
            .where('id', 'in', ids)
            .execute();
        case 'keyword':
          return kyselyDb
            .selectFrom('keywords')
            .select(['id', 'name', sql.lit(tokenType).as('type')])
            .where('id', 'in', ids)
            .execute();
        case 'streamer':
          return kyselyDb
            .selectFrom('streamers')
            .select(['id', 'name', sql.lit(tokenType).as('type')])
            .where('id', 'in', ids)
            .execute();
        case 'host':
          return kyselyDb
            .selectFrom('hosts')
            .select(['id', 'name', sql.lit(tokenType).as('type')])
            .where('id', 'in', ids)
            .execute();
        case 'movie':
          return kyselyDb
            .selectFrom('movies')
            .select(['id', 'title as name', sql.lit(tokenType).as('type')])
            .where('id', 'in', ids)
            .execute();
        case 'oscarsCategoriesNom':
          return kyselyDb
            .selectFrom('oscars_categories')
            .select(['id', 'name', sql.lit(tokenType).as('type')])
            .where('id', 'in', ids)
            .execute()
            .then(results =>
              results.map(item => ({ ...item, name: `Oscar Nom: ${titleCase(item.name)}` }))
            );
        case 'oscarsCategoriesWon':
          return kyselyDb
            .selectFrom('oscars_categories')
            .select(['id', 'name', sql.lit(tokenType).as('type')])
            .where('id', 'in', ids)
            .execute()
            .then(results =>
              results.map(item => ({ ...item, name: `Oscar Won: ${titleCase(item.name)}` }))
            );
        default:
          const exhaustiveCheck: never = tokenType;
          throw new Error(`Unhandled token case: ${exhaustiveCheck}`);
      }
    })
  );

  return response.flat();
};
