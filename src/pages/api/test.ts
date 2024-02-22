import type { NextApiRequest, NextApiResponse } from 'next';
import { getLeaderboard } from '~/apik/get-leaderboard';
import { defaultQps } from '~/data/query-params';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await getLeaderboard({
    field: 'director',
    subField: 'mostFilms',
    params: { ...defaultQps, movieMode: 'rewa' },
  });
  res.status(200).json(response);
}
