import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from '~/prisma';

const prisma = Prisma.getPrisma();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await prisma.movies.findFirst({
    where: { id: Number(req.query.id) },
    select: {
      title: true,
      crew_on_movies: {
        select: {
          job: true,
          crew: { select: { name: true } },
        },
      },
    },
  });
  res
    .status(200)
    .json({
      title: response?.title,
      crew: response?.crew_on_movies.map(c => ({ name: c.crew.name, job: c.job })),
    });
}
