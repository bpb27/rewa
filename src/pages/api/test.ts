import type { NextApiRequest, NextApiResponse } from 'next';
import { getMovies } from '~/apik/get-movies';
import { defaultQps } from '~/data/query-params';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await getMovies({
    ...defaultQps,
    sort: 'release_date',
    // keyword: [249],
    movieMode: 'rewa',
  });
  res.status(200).json(response);
}
