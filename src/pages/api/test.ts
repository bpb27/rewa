import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from '~/prisma';

const prisma = Prisma.getPrisma();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await prisma.movies.findMany({
    select: {
      title: true,
      id: true,
    },
    where: {
      oscars_nominations: { none: {} },
      episodes: { none: {} },
    },
  });
  res.status(200).json(response);
}
