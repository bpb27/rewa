import type { NextApiRequest, NextApiResponse } from 'next';
import { groupBy } from 'remeda';
import { Prisma } from '~/prisma';

const prisma = Prisma.getPrisma();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await prisma.oscars_nominations.findMany({
    include: { award: true },
  });
  const grouped = Object.values(groupBy(response, n => n.ceremony_year)).map(ceremony =>
    Object.values(groupBy(ceremony, c => c.award_id))
  );
  const missing: any[] = [];
  grouped.forEach(ceremonyList => {
    ceremonyList.forEach(awardGroup => {
      const { ceremony_year: ceremonyYear, award } = awardGroup[0];
      if (!awardGroup.find(nom => nom.won) && ceremonyYear !== 2024) {
        missing.push({
          award_id: award.id,
          award_name: award.name,
          ceremony_year: ceremonyYear,
          recipient: '',
          tmdb_id: 0,
          won: true,
        });
      }
    });
  });
  res.status(200).json(missing);
}
