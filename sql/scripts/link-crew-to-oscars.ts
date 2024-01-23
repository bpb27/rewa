import { Prisma } from '../../src/prisma';

const prisma = Prisma.getPrisma();

const run = async () => {
  const oscars = await prisma.oscars_nominations.findMany({
    select: {
      id: true,
      movie_id: true,
      recipient: true,
      movie: {
        select: {
          id: true,
          title: true,
          release_date: true,
          crew_on_movies: {
            select: { crew: { select: { id: true, name: true } } },
          },
        },
      },
    },
    where: {
      award: {
        oscars_categories: {
          name: {
            in: ['cinematography'],
          },
        },
      },
    },
  });

  const mapped = oscars
    .map(oscar => {
      return oscar.recipient
        .split(',')
        .map(r => r.trim())
        .map(recipient => {
          const crew = oscar.movie.crew_on_movies
            .map(jt => jt.crew)
            .find(c => c.name === recipient);
          return {
            crewId: crew?.id,
            oscarId: oscar.id,
            movieName: oscar.movie.title,
            crewName: crew?.name,
            recipient: oscar.recipient,
          };
        });
    })
    .flat();

  const needsConjunctionNormalization = mapped.filter(o => o.recipient.includes(' and '));
  const needsNameNormalization = mapped.filter(o => !o.crewId);
  if (needsConjunctionNormalization.length) {
    console.log(JSON.stringify(needsConjunctionNormalization, null, 2));
    throw new Error(
      `normalize these ${needsConjunctionNormalization.length} conjoined names first`
    );
  }
  if (needsNameNormalization.length) {
    console.log(JSON.stringify(needsNameNormalization, null, 2));
    throw new Error(`normalize these ${needsNameNormalization.length} names first`);
  }

  const add = async (i: number) => {
    const oscar = mapped[i];
    if (!oscar) return console.log('done', i);
    // await prisma.crew_on_oscars.create({
    //   data: { crew_id: oscar.crewId!, oscar_id: oscar.oscarId },
    // });
    console.log(`added ${oscar.crewName} on ${oscar.movieName}`);
    add(i + 1);
  };

  add(0);
};

run();
