import { Prisma as PrismaBaseType } from '@prisma/client';
import { z } from 'zod';
import { Prisma } from '~/prisma';

const prisma = Prisma.getPrisma();

type QueryWhere = Pick<PrismaBaseType.oscars_nominationsFindManyArgs, 'where'>;

const yearWhere = ({
  year,
  yearGte,
  yearLte,
}: z.infer<typeof getOscarsByYearParams>): QueryWhere['where'] => {
  if (year) return { ceremony_year: year };
  if (yearGte && yearLte) return { ceremony_year: { gte: yearGte, lte: yearLte } };
  if (yearGte) return { ceremony_year: { gte: yearGte } };
  if (yearLte) return { ceremony_year: { lte: yearLte } };
  return {};
};

export const getOscarsByYearParams = z.object({
  year: z.number().optional(),
  yearGte: z.number().optional(),
  yearLte: z.number().optional(),
});

export const getOscarsByYear = async ({
  year,
  yearGte,
  yearLte,
}: z.infer<typeof getOscarsByYearParams>) => {
  const response = await prisma.oscars_nominations.findMany({
    where: {
      ...yearWhere({ year, yearGte, yearLte }),
    },
    include: {
      award: { include: { oscars_categories: true } },
      movie: {
        select: { id: true, title: true, poster_path: true, overview: true, release_date: true },
      },
      crew_on_oscars: { select: { crew: { select: { id: true, name: true } } } },
      actors_on_oscars: {
        select: { actors: { select: { id: true, name: true, profile_path: true } } },
      },
    },
    orderBy: { ceremony_year: 'desc' },
  });

  return response.map(nom => ({
    id: nom.id,
    actors: nom.actors_on_oscars.map(jt => jt.actors),
    awardName: nom.award.name,
    categoryId: nom.award.oscars_categories.id,
    categoryName: nom.award.oscars_categories.name,
    ceremonyYear: nom.ceremony_year,
    crew: nom.crew_on_oscars.map(jt => jt.crew),
    movie: nom.movie,
    recipient: nom.recipient,
    won: nom.won,
  }));
};
