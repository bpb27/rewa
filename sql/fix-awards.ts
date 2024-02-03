import { Prisma } from '../src/prisma';
const prisma = Prisma.getPrisma();

// TODO: add constraint

const run = async () => {
  const awardsWithNominations = await prisma.oscars_nominations.findMany({
    select: {
      award_id: true,
    },
    distinct: ['award_id'],
  });

  await prisma.oscars_awards.deleteMany({
    where: {
      NOT: {
        id: {
          in: awardsWithNominations.map(award => award.award_id),
        },
      },
    },
  });
};

run();
