import type { NextApiRequest, NextApiResponse } from 'next';
import { getLeaderboard } from '~/api/get-leaderboard';
import { defaultQps } from '~/data/query-params';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await getLeaderboard({
    field: 'director',
    params: { ...defaultQps, movieMode: 'rewa' },
  });
  res.status(200).json(response);
}
