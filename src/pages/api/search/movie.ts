import type { NextApiRequest, NextApiResponse } from 'next';
import { searchMovies } from '~/data/search';

export type GetMoviesBySearchResponse = NonNullable<Awaited<ReturnType<typeof searchMovies>>>;

const handler = async (req: NextApiRequest, res: NextApiResponse<GetMoviesBySearchResponse>) => {
  const { search } = req.query;
  if (typeof search !== 'string' || !search) {
    return res.status(200).json([]);
  } else {
    const response = await searchMovies(search);
    res.status(200).json(response);
  }
};

export default handler;
