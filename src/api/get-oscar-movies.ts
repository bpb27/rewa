import { Prisma } from '~/prisma';

const prisma = Prisma.getPrisma();

export const getOscarMovies = async () => {
  const response = await prisma.movies.findMany({
    select: { id: true, title: true, tmdb_id: true },
    where: {
      oscars_nominations: {
        some: { award: { AND: { oscars_categories: { relevance: 'high' } } } },
      },
    },
  });
  return response;
};
