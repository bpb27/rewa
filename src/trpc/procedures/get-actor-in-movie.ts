import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { Prisma } from '~/prisma';
import { procedure } from '../trpc';

const prisma = Prisma.getPrisma();

export const getActorInMovie = procedure
  .input(
    z.object({
      actorId: z.number(),
      movieId: z.number(),
    })
  )
  .query(async ({ input }) => {
    const response = await prisma.actors_on_movies.findFirst({
      where: { movie_id: input.movieId, actor_id: input.actorId },
      include: { actors: true },
    });

    if (!response?.actors) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    return {
      character: response.character,
      name: response.actors.name,
    };
  });
