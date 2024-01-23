import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from '~/prisma';

const prisma = Prisma.getPrisma();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const stuff = await prisma.movies.findMany({
    select: { id: true, title: true },
    orderBy: { release_date: 'desc' },
    where: {
      title: { equals: 'stuff' },
    },
  });
  res.status(200).json({ stuff });
}
