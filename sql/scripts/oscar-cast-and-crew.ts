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
          actors_on_movies: {
            select: { actors: { select: { id: true, name: true } } },
          },
        },
      },
    },
    where: {
      award: {
        oscars_categories: {
          name: {
            in: ['supporting_actress', 'actress', 'supporting_actor', 'actor'],
          },
        },
      },
    },
  });

  const stuff = oscars.map(oscar => {
    const actor = oscar.movie.actors_on_movies
      .map(aom => aom.actors)
      .find(a => a.name === oscar.recipient);
    const movie = oscar.movie.title;
    return { actor: actor?.name, movie, recipient: oscar.recipient };
  });

  console.log('total records', stuff.length);

  console.log(
    JSON.stringify(
      stuff.filter(t => !t.actor),
      null,
      2
    )
  );
};

run();
