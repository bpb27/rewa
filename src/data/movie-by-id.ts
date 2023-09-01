import { Prisma } from '~/prisma';
import { formatDate, moneyShort } from '~/utils/format';

const prisma = Prisma.getPrisma();

const selectIdAndName = { select: { id: true, name: true } };

export const getMovieById = async (movieId: number, actorId?: number) => {
  const movie = await prisma.movies.findFirst({
    where: { id: movieId },
    select: {
      budget: true,
      id: true,
      imdb_id: true,
      poster_path: true,
      release_date: true,
      revenue: true, // NB: stored in DB as / 1000 due to BigInt shit
      runtime: true,
      title: true,
      tagline: true,
      actors_on_movies: {
        take: 3,
        orderBy: { credit_order: 'asc' },
        select: { actors: selectIdAndName },
      },
      crew_on_movies: {
        where: { job: 'Director' },
        select: {
          job: true,
          crew: selectIdAndName,
        },
      },
      episodes: {
        select: {
          spotify_url: true,
          hosts_on_episodes: { select: { hosts: selectIdAndName } },
        },
      },
      streamers_on_movies: {
        select: { streamers: selectIdAndName },
      },
    },
  });

  const actor = actorId
    ? await prisma.actors_on_movies.findFirst({
        where: { movie_id: movieId, actor_id: actorId },
        include: { actors: true },
      })
    : null;

  if (!movie) throw new Error('Cant find that shit');
  const [episode] = movie.episodes;
  return {
    budget: moneyShort(movie.budget),
    character: actor?.character,
    id: movie.id,
    imdb_id: movie.imdb_id,
    poster_path: movie.poster_path,
    release_date: formatDate(movie.release_date),
    revenue: moneyShort(movie.revenue * 1000),
    runtime: `${movie.runtime} mins`,
    spotify_url: episode?.spotify_url,
    tagline: movie.tagline,
    title: movie.title,
    hosts: episode?.hosts_on_episodes.map(j => j.hosts!).filter(i => i) || [],
    streamers: movie.streamers_on_movies.map(j => j.streamers!).filter(i => i),
    directors: movie.crew_on_movies.map(j => j.crew!).filter(i => i),
    actors: movie.actors_on_movies.map(j => j.actors!).filter(i => i),
  };
};
