import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from '~/prisma';

const prisma = Prisma.getPrisma();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.time('querying');
  const response = await prisma.movies.findMany({
    select: {
      title: true,
      streamers_on_movies: {
        select: {
          streamers: { select: { name: true } },
        },
      },
    },
    take: 25,
    where: {
      episodes: {
        some: {},
      },
    },
  });
  console.timeEnd('querying');
  res.status(200).json(response);
}
