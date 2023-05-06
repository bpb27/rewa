import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '~/db/db';

const getMovieById = (id: number) => db.movieById(id, (movie) => movie);

export type GetMovieByIdResponse = ReturnType<typeof getMovieById>;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<GetMovieByIdResponse>
) => {
  const id = Number(req.query.id);
  const movie = getMovieById(id);
  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(404);
  }
};

export default handler;
