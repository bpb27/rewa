import type { NextApiRequest, NextApiResponse } from 'next';
import { getOscarMovies } from '~/api/get-oscar-movies';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const movies = await getOscarMovies();
  res.status(200).json({ total: movies.length, movies });
}
