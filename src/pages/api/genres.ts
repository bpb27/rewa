import { Prisma, PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Prisma.GenreGetPayload<{}>[]>
) => {
  const genres = await prisma.genre.findMany();
  res.status(200).json(genres);
};

export default handler;
