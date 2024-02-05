import { z } from 'zod';
import { movieFilters } from '~/data/movie-search-conditions';
import { parsedQpSchema } from '~/data/query-params';
import { Prisma } from '~/prisma';
import { smartSort } from '~/utils/sorting';

const prisma = Prisma.getPrisma();

export const getTopProductionCompaniesParams = parsedQpSchema;

export const getTopProductionCompanies = async (
  params: z.infer<typeof getTopProductionCompaniesParams>
) => {
  const top = await prisma.production_companies_on_movies.groupBy({
    by: ['production_company_id'],
    orderBy: {
      _count: {
        production_company_id: 'desc',
      },
    },
    where: {
      movies: movieFilters(params),
    },
    take: 25,
  });

  const response = await prisma.production_companies.findMany({
    where: {
      id: { in: top.map(c => c.production_company_id) },
    },
    select: {
      name: true,
      id: true,
      logo_path: true,
      production_companies_on_movies: {
        where: {
          movies: movieFilters(params),
        },
        select: {
          movies: {
            select: {
              title: true,
              id: true,
              poster_path: true,
              release_date: true,
            },
          },
        },
      },
    },
  });

  return smartSort(
    response.map(company => ({
      name: company.name,
      id: company.id,
      logo_path: company.logo_path,
      total: company.production_companies_on_movies.map(jt => jt.movies).length,
      movies: company.production_companies_on_movies.map(jt => jt.movies),
    })),
    company => company.movies.length,
    'desc'
  );
};
