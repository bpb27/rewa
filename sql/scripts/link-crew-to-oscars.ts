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
            in: ['directing'],
          },
        },
      },
    },
  });

  const mapped = oscars.map(oscar => {
    const crew = oscar.movie.crew_on_movies
      .map(jt => jt.crew)
      .find(a => a.name === oscar.recipient);
    return {
      crewId: crew?.id,
      oscarId: oscar.id,
      movieName: oscar.movie.title,
      crewName: crew?.name,
      recipient: oscar.recipient,
    };
  });

  // const add = async (i: number) => {
  //   const oscar = mapped[i];
  //   if (!oscar) return console.log('done', i);
  //   await prisma.oscars_nominations.update({
  //     where: { id: oscar.oscarId },
  //     data: { crew_id: oscar.crewId },
  //   });
  //   console.log(`added ${oscar.crewName} on ${oscar.movieName}`);
  //   add(i + 1);
  // };

  // add(0);

  console.log('Total: ', mapped.length);
  console.log(
    JSON.stringify(
      mapped.filter(o => !o.crewId),
      null,
      2
    )
  );
};

run();
