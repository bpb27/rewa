import { isDefined } from 'remeda';
import { Prisma } from '~/prisma';

const prisma = Prisma.getPrisma();

export const sortByEpisode = async ({
  asc,
  amount,
  movieCursor,
}: {
  asc: boolean;
  amount: number;
  movieCursor: number;
}): Promise<number[]> => {
  const result = await prisma.episodes.findMany({
    orderBy: { episode_order: asc ? 'asc' : 'desc' },
    take: amount,
    select: { movie_id: true },
    where: { movie_id: { gt: movieCursor } },
  });
  return result.map(item => item.movie_id).filter(isDefined);
};

export const sortByProfit = async ({
  asc,
  amount,
  movieCursor,
}: {
  asc: boolean;
  amount: number;
  movieCursor: number;
}): Promise<number[]> => {
  const result: { id: number }[] = asc
    ? await prisma.$queryRaw`
        SELECT id, ((revenue * 1000 - budget) / budget) AS profit_percentage
        FROM movies 
        WHERE budget > 0 AND id > ${movieCursor}
        ORDER BY profit_percentage ASC
        LIMIT ${amount};
    `
    : await prisma.$queryRaw`
        SELECT id, ((revenue * 1000 - budget) / budget) AS profit_percentage
        FROM movies 
        WHERE budget > 0 AND id > ${movieCursor}
        ORDER BY profit_percentage DESC
        LIMIT ${amount};
    `;
  return result.map(item => item.id);
};
