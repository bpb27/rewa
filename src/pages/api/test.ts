import type { NextApiRequest, NextApiResponse } from 'next';
import { getLeaderboard } from '~/api/get-leaderboard';
import { defaultQps } from '~/data/query-params';
import { Prisma } from '~/prisma';

const prisma = Prisma.getPrisma();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await getLeaderboard({
    field: 'actor',
    params: {
      ...defaultQps,
      movieMode: 'oscar',
      yearGte: [1999],
    },
  });
  res.status(200).json(response);
}
