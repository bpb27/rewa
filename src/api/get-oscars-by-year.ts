import { z } from 'zod';
import { Prisma } from '~/prisma';

const prisma = Prisma.getPrisma();

export type GetOscarsByYearParams = z.infer<typeof getOscarsByYearParams>;
export type GetOscarsByYearResponse = Awaited<ReturnType<typeof getOscarsByYear>>;

export const getOscarsByYearParams = z.object({
  year: z.number(),
});

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
