import { uniqBy } from 'remeda';
import { z } from 'zod';
import { Prisma } from '~/prisma';
import { appEnums } from '~/utils/enums';
import { getYear } from '~/utils/format';
import { smartSort } from '~/utils/sorting';

const prisma = Prisma.getPrisma();

export const getActorParams = z.object({
  id: z.number(),
  filter: appEnums.movieMode.schema,
  field: appEnums.topCategory.schema.optional(),
});

export const getActor = async ({ id, field, filter }: z.infer<typeof getActorParams>) => {
  const actorResponse = await prisma.actors.findFirstOrThrow({
    where: { id },
    include: {
      actors_on_movies: {
        where: {
          movies: {
            ...(filter === 'rewa' ? { episodes: { some: {} } } : undefined),
            ...(filter === 'oscar' ? { oscars_nominations: { some: {} } } : undefined),
          },
        },
        include: {
          movies: {
            select: {
              title: true,
              release_date: true,
              id: true,
              oscars_nominations: {
                include: {
                  actors_on_oscars: true,
                  award: { include: { oscars_categories: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  const movies = actorResponse.actors_on_movies
    .filter(om => om.movies)
    .map(role => {
      const oscar = role.movies.oscars_nominations.find(nom =>
        nom.actors_on_oscars.find(a => a.actor_id === role.actor_id)
      );
      return {
        oscar: oscar ? { award: oscar.award.oscars_categories.name, won: oscar.won } : undefined,
        character: role.character,
        movieId: role.movie_id,
        releaseDate: role.movies.release_date,
        title: role.movies.title,
        year: getYear(role.movies.release_date),
      };
    })
    .filter(role => (field === 'actorNoms' ? role.oscar : true));

  return {
    id,
    name: actorResponse.name,
    image: actorResponse.profile_path,
    movies: uniqBy(
      smartSort(movies, movie => movie.releaseDate),
      m => m.movieId
    ),
  };
};
