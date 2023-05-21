import type { NextApiRequest, NextApiResponse } from 'next';
import { omit } from 'remeda';
import { Prisma } from '~/prisma';
import fs from 'fs';

const db = fs.readFile('src/database/db.sqlite', (error) => {
  if (error) console.log('Unable to find db');
});

const prisma = Prisma.getPrisma();

const getMovieById = async (movieId: number, actorId?: number) => {
  const movie = await prisma.movies.findFirst({
    where: { id: movieId },
  });
  let actor = null;
  if (actorId) {
    const actorResponse = await prisma.actors_on_movies.findFirst({
      where: { movie_id: movieId, actor_id: actorId },
      include: { actors: true },
    });
    if (actorResponse) {
      actor = omit({ ...actorResponse, ...actorResponse.actors }, [
        'actors',
        'id',
      ]);
    }
  }
  return { actor, movie };
};

export type GetMovieByIdResponse = NonNullable<
  Awaited<ReturnType<typeof getMovieById>>
>;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<GetMovieByIdResponse>
) => {
  const response = await getMovieById(
    Number(req.query.id),
    Number(req.query.actorId)
  );
  if (response && response.movie) {
    res.status(200).json(response);
  } else {
    res.status(404);
  }
};

export default handler;
