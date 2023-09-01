import type { NextApiRequest, NextApiResponse } from 'next';
import { getMovieById } from '~/data/movie-by-id';

export type GetMovieByIdResponse = Awaited<ReturnType<typeof getMovieById>>;

const handler = async (req: NextApiRequest, res: NextApiResponse<GetMovieByIdResponse>) => {
  const movieId = Number(req.query.id);
  const actorId = req.query.actorId ? Number(req.query.actorId) : undefined;
  try {
    const response = await getMovieById(movieId, actorId);
    res.status(200).json(response);
  } catch (e) {
    res.status(404);
  }
};

export default handler;
