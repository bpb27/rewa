import { z } from 'zod';
import { kyselyDb } from '../../pg/db';

export const getActorRoleParams = z.object({
  actorId: z.number(),
  movieId: z.number(),
});

export const getActorRole = async (params: z.infer<typeof getActorRoleParams>) => {
  const response = await kyselyDb
    .selectFrom('actors_on_movies')
    .innerJoin('actors', 'actors.id', 'actors_on_movies.actor_id')
    .select(['actors.name', 'actors_on_movies.character'])
    .where('actors_on_movies.actor_id', '=', params.actorId)
    .where('actors_on_movies.movie_id', '=', params.movieId)
    .execute();

  if (!response.length) throw new Error('Not found');
  return response[0];
};
