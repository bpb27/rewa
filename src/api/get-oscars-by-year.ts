import { z } from 'zod';
import prisma from '~/prisma';

export const getOscarsByYearParams = z.object({
  year: z.number(),
});

export const getOscarsByYear = async ({ year }: z.infer<typeof getOscarsByYearParams>) => {
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
