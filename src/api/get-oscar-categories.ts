import prisma from '~/prisma';

export const getOscarCategories = async () => {
  const response = await prisma.oscars_categories.findMany();
  return response;
};
