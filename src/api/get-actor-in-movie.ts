import { Prisma } from '~/prisma';

const prisma = Prisma.getPrisma();

type GetActorInMovieParams = { actorId: number; movieId: number };
export type GetActorInMovieResponse = Awaited<ReturnType<typeof getActorInMovie>>;

export const getActorInMovie = async ({ actorId, movieId }: GetActorInMovieParams) => {
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
