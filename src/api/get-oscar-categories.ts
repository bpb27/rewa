import { Prisma } from '~/prisma';

const prisma = Prisma.getPrisma();

export const getOscarCategories = async () => {
  const response = await prisma.oscars_categories.findMany();
  return response;
};
