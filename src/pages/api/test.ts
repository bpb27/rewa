import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from '~/prisma';

const prisma = Prisma.getPrisma();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const stuff = await prisma.crew.findMany({
    where: {
      crew_on_oscars: {
        some: { oscars_nominations: {} },
      },
    },
    select: {
      name: true,
      crew_on_oscars: {
        select: {
          oscars_nominations: {
            select: {
              won: true,
              movie: {
                select: {
                  title: true,
                },
              },
              award: {
                select: {
                  oscars_categories: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  const data = stuff.map(a => ({
    crew: a.name,
    noms: a.crew_on_oscars
      .map(jt => jt.oscars_nominations)
      .map(o => ({
        movie: o.movie.title,
        won: o.won,
        award: o.award.oscars_categories.name,
      })),
  }));
  res.status(200).json({ data, total: data.length });
}
