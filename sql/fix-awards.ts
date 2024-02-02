import { Prisma } from '../src/prisma';
const prisma = Prisma.getPrisma();

// TODO: add constraint

const run = async () => {
  const awards = await prisma.oscars_awards.findMany({
    orderBy: { id: 'asc' },
  });
  const picked = awards.reduce(
    (hash, a) => ({
      ...hash,
      [a.name]: a,
    }),
    {} as Record<string, { name: string; id: number; category_id: number }>
  );

  for (const a of awards) {
    if (picked[a.name].id !== a.id) {
      await prisma.oscars_nominations.updateMany({
        where: { award_id: a.id },
        data: {
          award_id: picked[a.name].id,
        },
      });
    }
  }

  //   console.log(Object.keys(picked).length, awards.length);
};

run();
