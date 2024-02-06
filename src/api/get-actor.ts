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
});

const MOVIE_SELECT = { select: { title: true, release_date: true, id: true } };
const episodeWhere = { movies: { episodes: { some: {} } } };
const oscarWhere = { movies: { oscars_nominations: { some: {} } } };

export const getActor = async ({ id, filter }: z.infer<typeof getActorParams>) => {
  const actorResponse = await prisma.actors.findFirstOrThrow({
    where: { id },
    include: {
      actors_on_movies: {
        where: {
          ...(filter === 'rewa' ? episodeWhere : undefined),
          ...(filter === 'oscar' ? oscarWhere : undefined),
        },
        include: {
          movies: MOVIE_SELECT,
        },
      },
    },
  });

  const crewResponse = await prisma.crew.findFirst({
    where: { tmdb_id: actorResponse.tmdb_id },
    select: {
      crew_on_movies: {
        where: {
          ...(filter === 'rewa' ? episodeWhere : undefined),
          ...(filter === 'oscar' ? oscarWhere : undefined),
        },
        include: { movies: { ...MOVIE_SELECT } },
      },
    },
  });

  return {
    id,
    name: actorResponse.name,
    profilePath: actorResponse.profile_path,
    movies: uniqBy(
      smartSort(
        actorResponse.actors_on_movies
          .filter(om => om.movies)
          .map(role => ({
            character: role.character,
            movieId: role.movie_id,
            releaseDate: role.movies.release_date,
            title: role.movies.title,
            year: getYear(role.movies.release_date),
          })),
        movie => movie.releaseDate
      ),
      m => m.movieId
    ),
    crewMovies: smartSort(
      (crewResponse?.crew_on_movies || [])
        .filter(om => om.movies)
        .map(crew => ({
          job: crew.job,
          movieId: crew.movies.id,
          releaseDate: crew.movies.release_date,
          title: crew.movies.title,
          year: getYear(crew.movies.release_date),
        })),
      movie => movie.releaseDate
    ),
  };
};
