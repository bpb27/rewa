import { z } from 'zod';
import { appEnums } from '~/utils/enums';
import { kyselyDb } from '../../pg/db';
import { reusableSQL } from './reusable';

export const getLanguagesParams = z.object({
  movieMode: appEnums.movieMode.schema,
});

export const getLanguages = async (params: z.infer<typeof getLanguagesParams>) => {
  return kyselyDb
    .selectFrom('languages')
    .innerJoin(
      'spoken_languages_on_movies',
      'spoken_languages_on_movies.language_id',
      'languages.id'
    )
    .innerJoin('movies', 'spoken_languages_on_movies.movie_id', 'movies.id')
    .select([
      'languages.id',
      'name',
      eb => eb.fn.count('spoken_languages_on_movies.language_id').as('total'),
    ])
    .where(reusableSQL.where.movieMode(params.movieMode))
    .groupBy('languages.id')
    .orderBy('total desc')
    .execute();
};
