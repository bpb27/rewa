import { Prisma } from '~/prisma';
import { smartSort } from '~/utils/sorting';

const prisma = Prisma.getPrisma();

type GetActorParams = { id: number };
export type GetActorResponse = Awaited<ReturnType<typeof getActor>>;

const MOVIE_SELECT = { select: { title: true, release_date: true, id: true } };

export const getActor = async ({ id }: GetActorParams) => {
  const actorResponse = await prisma.actors.findFirstOrThrow({
    where: { id },
    include: {
      actors_on_movies: {
        include: {
          movies: MOVIE_SELECT,
        },
      },
    },
  });

  const crewResponse = await prisma.crew.findFirst({
    where: { tmdb_id: actorResponse.tmdb_id },
    select: { crew_on_movies: { include: { movies: MOVIE_SELECT } } },
  });

  return {
    id,
    name: actorResponse.name,
    profile_path: actorResponse.profile_path,
    movies: smartSort(
      actorResponse.actors_on_movies.map(role => ({
        character: role.character,
        movieId: role.movie_id!,
        release_date: role.movies?.release_date!,
        title: role.movies?.title!,
      })),
      movie => movie.release_date,
      true
    ),
    crewMovies: smartSort(
      (crewResponse?.crew_on_movies || []).map(crew => ({
        job: crew.job,
        release_date: crew.movies?.release_date!,
        title: crew.movies?.title!,
        movieId: crew.movies?.id!,
      })),
      movie => movie.release_date,
      true
    ),
  };
};
