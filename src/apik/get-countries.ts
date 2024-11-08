import { z } from 'zod';
import { appEnums } from '~/utils/enums';
import { kyselyDb } from '../../pg/db';
import { reusableSQL } from './reusable';

export const getCountriesParams = z.object({
  movieMode: appEnums.movieMode.schema,
});

export const getCountries = async (params: z.infer<typeof getCountriesParams>) => {
  return kyselyDb
    .selectFrom('countries')
    .innerJoin(
      'production_countries_on_movies',
      'production_countries_on_movies.country_id',
      'countries.id'
    )
    .innerJoin('movies', 'production_countries_on_movies.movie_id', 'movies.id')
    .select([
      'countries.id',
      'name',
      eb => eb.fn.count('production_countries_on_movies.country_id').as('total'),
    ])
    .where(reusableSQL.where.movieMode(params.movieMode))
    .groupBy('countries.id')
    .orderBy('total desc')
    .execute();
};
