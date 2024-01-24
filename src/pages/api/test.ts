import type { NextApiRequest, NextApiResponse } from 'next';
import { getTopProductionCompanies } from '~/api/get-top-production-companies';
import { Prisma } from '~/prisma';

const prisma = Prisma.getPrisma();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const stuff = await getTopProductionCompanies({ mode: 'oscars' });
  res.status(200).json(stuff);
}
