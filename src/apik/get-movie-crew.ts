import { z } from 'zod';
import { appEnums } from '~/utils/enums';
import { kyselyDb } from '../../pg/db';
import { reusableSQL } from './reusable';

export const getMovieCrewParams = z.object({
  movieId: z.number(),
  movieMode: appEnums.movieMode.schema,
});

export const getMovieCrew = async (params: z.infer<typeof getMovieCrewParams>) => {
  return kyselyDb
    .selectFrom('crew_on_movies')
    .innerJoin('crew', 'crew.id', 'crew_on_movies.crew_id')
    .innerJoin('crew_jobs', 'crew_jobs.id', 'crew_on_movies.job_id')
    .select([
      'crew.id',
      'crew.name',
      'crew.profile_path as image',
      'crew_jobs.job',
      'crew_on_movies.job_id as jobId',
      'crew_on_movies.credit_id as creditId',
      eb =>
        eb
          .selectFrom('movies')
          .innerJoin('crew_on_movies as com_sub', 'com_sub.movie_id', 'movies.id')
          .select(eb => eb.fn.count('movies.id').distinct().as('total'))
          .where(reusableSQL.where.movieMode(params.movieMode))
          .whereRef('com_sub.crew_id', '=', 'crew.id')
          .as('total'),
    ])
    .where('crew_on_movies.movie_id', '=', params.movieId)
    .execute();
};
