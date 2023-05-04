import { Prisma, PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Prisma.MovieGetPayload<{}>>
) => {
  const movie = await prisma.movie.findFirst({
    include: {
      genres: {
        select: {
          genre: true,
        },
      },
      production_companies: {
        select: {
          productionCompany: true,
        },
      },
      cast: true,
      crew: true,
    },
  });
  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(404);
  }
};

export default handler;
