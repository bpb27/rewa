import type { NextApiRequest, NextApiResponse } from 'next';
// import { Prisma } from '~/prisma';
import { kyselyDb } from '../../../prisma/kysley';

// const prisma = Prisma.getPrisma();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await kyselyDb
    .selectFrom('movies_with_computed_fields')
    .select(['title', 'episode_order', 'total_oscar_nominations'])
    .where('episode_order', '>', 0)
    .where('total_oscar_nominations', '>', 0)
    .execute();
  // const response = await prisma.movies_with_computed_fields.findMany({
  //   select: {
  //     title: true,
  //     episode_order: true,
  //     total_oscar_nominations: true,
  //   },
  //   where: {
  //     episode_order: { gt: 0 },
  //     total_oscar_nominations: { gt: 0 },
  //   },
  //   take: 10,
  // });
  res.status(200).json(response);
}
