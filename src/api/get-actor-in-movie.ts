import { z } from 'zod';
import prisma from '~/prisma';

export const getActorInMovieParams = z.object({
  actorId: z.number(),
  movieId: z.number(),
});

export const getActorInMovie = async ({
  actorId,
  movieId,
}: z.infer<typeof getActorInMovieParams>) => {
  const response = await prisma.actors_on_movies.findFirst({
    where: { movie_id: movieId, actor_id: actorId },
    include: { actors: true },
  });

  if (!response || !response.actors) throw new Error('Not found');
  return {
    character: response.character,
    name: response.actors.name,
  };
};
