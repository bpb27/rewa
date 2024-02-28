import { jsonArrayFrom } from 'kysely/helpers/sqlite';
import { z } from 'zod';
import { crewJobs, crewToOscarCategory } from '~/data/crew-jobs';
import { QpSchema, parsedQpSchema } from '~/data/query-params';
import { AppEnums, appEnums } from '~/utils/enums';
import { kyselyDb } from '../../prisma/kysley';
import { allMovieFilters } from './reusable';

const LIMIT = 100;

export const getLeaderboardParams = z.object({
  field: appEnums.topCategory.schema,
  subField: appEnums.topCategorySub.schema,
  params: parsedQpSchema,
});

type GetLeaderboardResponse = {
  id: number;
  image: string | null;
  name: string;
  total: number;
  movies: {
    character?: string | null;
    id: number;
    image: string;
    oscarCategory?: string;
    oscarWon?: number;
    releaseDate: string;
    title: string;
  }[];
}[];

const addPagination = (response: GetLeaderboardResponse) => ({
  hasNext: false,
  page: 0,
  results: response.filter(p => p.total),
  total: response.filter(p => p.total).length,
});

export const getLeaderboard = async ({
  field,
  subField,
  params,
}: z.infer<typeof getLeaderboardParams>) => {
  if (field === 'actor') {
    return subField === 'mostFilms'
      ? getTopActors(params).then(addPagination)
      : getTopOscarActors(params, subField === 'mostWins').then(addPagination);
  } else {
    return subField === 'mostFilms'
      ? getTopCrew(params, crewJobs[field]).then(addPagination)
      : getTopOscarCrew(params, subField === 'mostWins', field).then(addPagination);
  }
};

const getTopActors = (params: QpSchema) =>
  kyselyDb
    .selectFrom('actors_on_movies')
    .innerJoin('actors', 'actors.id', 'actors_on_movies.actor_id')
    .innerJoin('movies', 'movies.id', 'actors_on_movies.movie_id')
    .select([
      'actors.id',
      'actors.name',
      'actors.profile_path as image',
      eb => eb.fn.count<number>('actors_on_movies.actor_id').as('total'),
      eb =>
        jsonArrayFrom(
          eb
            .selectFrom('actors_on_movies as jt')
            .innerJoin('movies', 'movies.id', 'jt.movie_id')
            .select([
              'movies.id',
              'movies.title',
              'movies.release_date as releaseDate',
              'movies.poster_path as image',
              'jt.character',
            ])
            .where(allMovieFilters(params))
            .whereRef('jt.actor_id', '=', 'actors.id')
            .groupBy('movies.id')
            .orderBy('movies.release_date asc')
        ).as('movies'),
    ])
    .where(allMovieFilters(params))
    .groupBy('actors_on_movies.actor_id')
    .limit(LIMIT)
    .orderBy('total desc')
    .execute();

const getTopCrew = (params: QpSchema, jobIds: number[]) =>
  kyselyDb
    .selectFrom('crew_on_movies')
    .innerJoin('crew', 'crew.id', 'crew_on_movies.crew_id')
    .innerJoin('movies', 'movies.id', 'crew_on_movies.movie_id')
    .select([
      'crew.id',
      'crew.name',
      'crew.profile_path as image',
      eb => eb.fn.count<number>('crew_on_movies.crew_id').as('total'),
      eb =>
        jsonArrayFrom(
          eb
            .selectFrom('crew_on_movies as jt')
            .innerJoin('movies', 'movies.id', 'jt.movie_id')
            .select([
              'movies.id',
              'movies.title',
              'movies.release_date as releaseDate',
              'movies.poster_path as image',
            ])
            .where('jt.job_id', 'in', jobIds)
            .where(allMovieFilters(params))
            .whereRef('jt.crew_id', '=', 'crew.id')
            .groupBy('movies.id')
            .orderBy('movies.release_date asc')
        ).as('movies'),
    ])
    .where('crew_on_movies.job_id', 'in', jobIds)
    .where(allMovieFilters(params))
    .groupBy('crew_on_movies.crew_id')
    .limit(LIMIT)
    .orderBy('total desc')
    .execute();

const getTopOscarActors = (params: QpSchema, wins: boolean) =>
  kyselyDb
    .selectFrom('actors_on_oscars')
    .innerJoin('actors', 'actors.id', 'actors_on_oscars.actor_id')
    .innerJoin('oscars_nominations', 'oscars_nominations.id', 'actors_on_oscars.oscar_id')
    .innerJoin('movies', 'movies.id', 'oscars_nominations.movie_id')
    .select([
      'actors.name',
      'actors.id',
      'actors.profile_path as image',
      eb => {
        let total = eb.fn.count<number>('oscars_nominations.id');
        if (wins) {
          total = total.filterWhere('oscars_nominations.won', '=', 1);
        }
        return total.as('total');
      },
      eb =>
        jsonArrayFrom(
          eb
            .selectFrom('actors_on_oscars')
            .innerJoin('oscars_nominations', 'oscars_nominations.id', 'actors_on_oscars.oscar_id')
            .innerJoin('oscars_awards', 'oscars_awards.id', 'oscars_nominations.award_id')
            .innerJoin('oscars_categories', 'oscars_categories.id', 'oscars_awards.category_id')
            .innerJoin('movies', 'movies.id', 'oscars_nominations.movie_id')
            .select([
              'movies.id',
              'movies.title',
              'movies.release_date as releaseDate',
              'movies.poster_path as image',
              'oscars_nominations.won as oscarWon',
              'oscars_categories.name as oscarCategory',
              eb =>
                eb
                  .selectFrom('actors_on_movies')
                  .select('actors_on_movies.character')
                  .whereRef('actors_on_movies.actor_id', '=', 'actors.id')
                  .whereRef('actors_on_movies.movie_id', '=', 'movies.id')
                  .as('character'),
            ])
            .where(allMovieFilters(params))
            .whereRef('actors_on_oscars.actor_id', '=', 'actors.id')
            .$if(wins, qb => qb.where('oscars_nominations.won', '=', 1))
            .orderBy('movies.release_date asc')
        ).as('movies'),
    ])
    .where(allMovieFilters(params))
    .groupBy('actors_on_oscars.actor_id')
    .limit(LIMIT)
    .orderBy('total desc')
    .execute();

const getTopOscarCrew = (
  params: QpSchema,
  wins: boolean,
  field: Exclude<AppEnums['topCategory'], 'actor'>
) =>
  kyselyDb
    .selectFrom('crew_on_oscars')
    .innerJoin('crew', 'crew.id', 'crew_on_oscars.crew_id')
    .innerJoin('oscars_nominations', 'oscars_nominations.id', 'crew_on_oscars.oscar_id')
    .innerJoin('oscars_awards', 'oscars_awards.id', 'oscars_nominations.award_id')
    .innerJoin('movies', 'movies.id', 'oscars_nominations.movie_id')
    .select([
      'crew.name',
      'crew.id',
      'crew.profile_path as image',
      eb => {
        let total = eb.fn.count<number>('oscars_nominations.id');
        if (wins) {
          total = total.filterWhere('oscars_nominations.won', '=', 1);
        }
        return total.as('total');
      },
      eb =>
        jsonArrayFrom(
          eb
            .selectFrom('crew_on_oscars')
            .innerJoin('oscars_nominations', 'oscars_nominations.id', 'crew_on_oscars.oscar_id')
            .innerJoin('oscars_awards', 'oscars_awards.id', 'oscars_nominations.award_id')
            .innerJoin('oscars_categories', 'oscars_categories.id', 'oscars_awards.category_id')
            .innerJoin('movies', 'movies.id', 'oscars_nominations.movie_id')
            .select([
              'movies.id',
              'movies.title',
              'movies.release_date as releaseDate',
              'movies.poster_path as image',
              'oscars_nominations.won as oscarWon',
              'oscars_categories.name as oscarCategory',
            ])
            .where('oscars_awards.category_id', 'in', crewToOscarCategory[field])
            .where(allMovieFilters(params))
            .whereRef('crew_on_oscars.crew_id', '=', 'crew.id')
            .$if(wins, qb => qb.where('oscars_nominations.won', '=', 1))
            .groupBy('movies.id')
            .orderBy('movies.release_date asc')
        ).as('movies'),
    ])
    .where('oscars_awards.category_id', 'in', crewToOscarCategory[field])
    .where(allMovieFilters(params))
    .groupBy('crew_on_oscars.crew_id')
    .orderBy('total desc')
    .limit(LIMIT)
    .execute();
