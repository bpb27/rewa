import { z } from 'zod';
import { appEnums } from '~/utils/enums';
import { kyselyDb } from '../../pg/db';
import { reusableSQL } from './reusable';

export const getMovieCastParams = z.object({
  movieId: z.number(),
  movieMode: appEnums.movieMode.schema,
});

export const getMovieCast = async (params: z.infer<typeof getMovieCastParams>) => {
  return kyselyDb
    .selectFrom('actors_on_movies')
    .innerJoin('actors', 'actors.id', 'actors_on_movies.actor_id')
    .select([
      'actors.id',
      'actors.name',
      'actors.profile_path as image',
      'actors_on_movies.character as role',
      'actors_on_movies.credit_order as creditOrder',
      eb =>
        eb
          .selectFrom('movies')
          .innerJoin('actors_on_movies as aom_sub', 'aom_sub.movie_id', 'movies.id')
          .select(eb => eb.fn.count('movies.id').distinct().as('total'))
          .where(reusableSQL.where.movieMode(params.movieMode))
          .whereRef('aom_sub.actor_id', '=', 'actors.id')
          .as('total'),
    ])
    .where('actors_on_movies.movie_id', '=', params.movieId)
    .orderBy('actors_on_movies.credit_order asc')
    .execute();
};
