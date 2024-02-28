import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/sqlite';
import { z } from 'zod';
import { kyselyDb } from '../../prisma/kysley';

export const getOscarsByYearParams = z.object({
  year: z.number().int().min(1900).max(2100),
});

export const getOscarsByYear = async (params: z.infer<typeof getOscarsByYearParams>) => {
  const response = await kyselyDb
    .selectFrom('oscars_nominations as noms')
    .innerJoin('oscars_awards as awards', 'awards.id', 'noms.award_id')
    .innerJoin('oscars_categories as cats', 'cats.id', 'awards.category_id')
    .innerJoin('movies', 'movies.id', 'noms.movie_id')
    .select([
      'noms.id',
      'awards.name as award',
      'cats.name as category',
      'cats.relevance',
      'noms.recipient',
      'noms.won',
      'movies.title',
      'movies.id as movieId',
      eb =>
        jsonObjectFrom(
          eb
            .selectFrom('actors_on_oscars')
            .innerJoin('actors', 'actors.id', 'actors_on_oscars.actor_id')
            .select(['actors.id', 'actors.name'])
            .whereRef('actors_on_oscars.oscar_id', '=', 'noms.id')
        ).as('actor'),
      eb =>
        jsonArrayFrom(
          eb
            .selectFrom('crew_on_oscars')
            .innerJoin('crew', 'crew.id', 'crew_on_oscars.crew_id')
            .select(['crew.id', 'crew.name'])
            .whereRef('crew_on_oscars.oscar_id', '=', 'noms.id')
        ).as('crew'),
    ])
    .where('ceremony_year', '=', params.year)
    .execute();

  return response;
};
