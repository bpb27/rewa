import { Prisma, PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse<{}>) => {
  const movies = await prisma.movie.findMany({
    select: {
      title: true,
      id: true,
      release_date: true,
      cast: true,
      genres: {
        select: { genre: true },
      },
      production_companies: {
        select: { productionCompany: true },
      },
      crew: true,
    },
    // take: 200,
    orderBy: {
      title: 'asc',
    },
  });
  res.status(200).json(movies);
};

export default handler;
