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

  const mapped = oscars.map(oscar => {
    const actor = oscar.movie.actors_on_movies
      .map(aom => aom.actors)
      .find(a => a.name === oscar.recipient);
    return {
      actorId: actor?.id,
      oscarId: oscar.id,
      movieName: oscar.movie.title,
      actorName: actor?.name,
    };
  });

  const add = async (i: number) => {
    const oscar = mapped[i];
    if (!oscar) return console.log('done', i);
    await prisma.actors_on_oscars.create({
      data: { actor_id: oscar.actorId!, oscar_id: oscar.oscarId },
    });
    console.log(`added ${oscar.actorName} on ${oscar.movieName}`);
    add(i + 1);
  };

  const misses = mapped.filter(o => !o.actorId);
  if (misses.length) {
    console.log('missing', JSON.stringify(misses, null, 2));
  } else {
    add(0);
  }
};

run();
