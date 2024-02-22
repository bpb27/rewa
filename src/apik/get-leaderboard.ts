import { jsonArrayFrom } from 'kysely/helpers/sqlite';
import { z } from 'zod';
import { crewJobs } from '~/data/crew-jobs';
import { parsedQpSchema } from '~/data/query-params';
import { appEnums } from '~/utils/enums';
import { kyselyDb } from '../../prisma/kysley';
import { allMovieFilters } from './reusable';

export const getLeaderboardParams = z.object({
  field: appEnums.topCategory.schema,
  subField: appEnums.topCategorySub.schema,
  params: parsedQpSchema,
});

export const getLeaderboard = async ({
  field,
  subField,
  params,
}: z.infer<typeof getLeaderboardParams>) => {
  if (field === 'actor') {
    const response = await kyselyDb
      .selectFrom('actors_on_movies')
      .innerJoin('actors', 'actors.id', 'actors_on_movies.actor_id')
      .innerJoin('movies', 'movies.id', 'actors_on_movies.movie_id')
      .select([
        'actors.id',
        'actors.name',
        eb => eb.fn.count<number>('actors_on_movies.actor_id').as('total'),
        eb =>
          jsonArrayFrom(
            eb
              .selectFrom('actors_on_movies as jt')
              .innerJoin('movies', 'movies.id', 'jt.movie_id')
              .select(['movies.id', 'movies.title', 'jt.character'])
              .where(allMovieFilters(params))
              .whereRef('jt.actor_id', '=', 'actors.id')
              .orderBy('movies.release_date asc')
          ).as('movies'),
      ])
      .where(allMovieFilters(params))
      .groupBy('actors_on_movies.actor_id')
      .limit(5)
      .orderBy('total desc')
      .execute();

    return response;
  } else {
    const response = await kyselyDb
      .selectFrom('crew_on_movies')
      .innerJoin('crew', 'crew.id', 'crew_on_movies.crew_id')
      .innerJoin('movies', 'movies.id', 'crew_on_movies.movie_id')
      .select([
        'crew.id',
        'crew.name',
        eb => eb.fn.count<number>('crew_on_movies.crew_id').as('total'),
        eb =>
          jsonArrayFrom(
            eb
              .selectFrom('crew_on_movies as jt')
              .innerJoin('movies', 'movies.id', 'jt.movie_id')
              .select(['movies.id', 'movies.title'])
              .where('crew_on_movies.job_id', 'in', crewJobs[field])
              .where(allMovieFilters(params))
              .whereRef('jt.crew_id', '=', 'crew.id')
              .groupBy('movies.id')
              .orderBy('movies.release_date asc')
          ).as('movies'),
      ])
      .where('crew_on_movies.job_id', 'in', crewJobs[field])
      .where(allMovieFilters(params))
      .groupBy('crew_on_movies.crew_id')
      .limit(5)
      .orderBy('total desc')
      .execute();

    return response;
  }
};
