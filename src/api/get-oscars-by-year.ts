import { Prisma } from '~/prisma';

const prisma = Prisma.getPrisma();

type GetOscarsByYearParams = { year: number };
export type GetOscarsByYearResponse = Awaited<ReturnType<typeof getOscarsByYear>>;

export const getOscarsByYear = async ({ year }: GetOscarsByYearParams) => {
  const response = await prisma.oscars_nominations.findMany({
    where: {
      ceremony_year: year,
    },
    include: {
      award: { include: { oscars_categories: true } },
      movie: { select: { title: true } },
    },
  });

  return response;
};
