import { Prisma } from '~/prisma';

const prisma = Prisma.getPrisma();

type GetOscarCategoriesParams = undefined;
export type GetOscarCategoriesResponse = Awaited<ReturnType<typeof getOscarCategories>>;

export const getOscarCategories = async () => {
  const response = await prisma.oscars_categories.findMany();
  return response;
};
