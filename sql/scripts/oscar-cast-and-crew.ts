import prisma from '../../src/prisma';
import { normalizeName } from '../../src/utils/format';

const run = async () => {
  const actingOscars = await prisma.oscars_nominations.findMany({
    select: {
      id: true,
      movie_id: true,
      recipient: true,
    },
    where: {
      award: {
        oscars_categories: {
          name: {
            in: ['actor', 'actress', 'supporting_actor', 'supporting_actress'],
          },
        },
      },
    },
  });

  const actors = await prisma.actors.findMany({
    select: {
      id: true,
      name: true,
      actors_on_movies: {
        select: { movie_id: true },
      },
    },
    where: {
      name: {
        in: actingOscars.map(ao => ao.recipient),
      },
    },
  });

  const movies = await prisma.movies.findMany({
    select: {
      id: true,
      title: true,
    },
  });

  const moviesIdHash = movies.reduce(
    (hash, o) => ({ ...hash, [o.id]: o.title }),
    {} as Record<number, string>
  );

  const oscarsNameHash = actingOscars.reduce(
    (hash, o) => ({ ...hash, [normalizeName(o.recipient)]: o }),
    {} as Record<string, (typeof actingOscars)[number]>
  );

  const actingNameHash = actors.reduce(
    (hash, o) => ({ ...hash, [normalizeName(o.name)]: o }),
    {} as Record<string, (typeof actors)[number]>
  );

  const actorNameToMovieIdsHash = actors.reduce(
    (hash, o) => ({
      ...hash,
      [normalizeName(o.name)]: o.actors_on_movies.map(aom => aom.movie_id),
    }),
    {} as Record<string, number[]>
  );

  actingOscars.forEach(ao => {
    const actorName = normalizeName(ao.recipient);
    if (!actingNameHash[actorName]) {
      console.log(`couldnt find ${actorName}`);
    } else if (!actorNameToMovieIdsHash[actorName]?.includes(ao.movie_id)) {
      console.log(`couldnt find ${actorName} movie ${moviesIdHash[ao.movie_id]}`);
    } else {
      // TODO: add actor_id on nomination
    }
  });

  console.log(actingOscars.length);
};

run();
