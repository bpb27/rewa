import { pick } from 'remeda';
import { Prisma } from '~/prisma';
import { getYear, moneyShort } from '~/utils/format';
import { Token } from '~/utils/token';

const prisma = Prisma.getPrisma();

const selectIdAndName = { select: { id: true, name: true } };

export const getMoviesForTable = async () => {
  const data = await prisma.movies.findMany({
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
          id: true,
          spotify_url: true,
          episode_order: true,
          hosts_on_episodes: { select: { hosts: selectIdAndName } },
        },
      },
      genres_on_movies: {
        select: { genres: selectIdAndName },
      },
      streamers_on_movies: {
        select: { streamers: selectIdAndName },
      },
    },
  });

  const movies = data.map(movie => {
    const episode = movie.episodes[0];

    const actors = movie.actors_on_movies
      .filter(jt => jt.actors)
      .map(jt => jt.actors!)
      .map(item => ({ ...item, type: 'actor' } satisfies Token));

    const hosts = episode.hosts_on_episodes
      .filter(jt => jt.hosts)
      .map(jt => jt.hosts!)
      .map(item => ({ ...item, type: 'host' } satisfies Token));

    const directors = movie.crew_on_movies
      .filter(jt => jt.job === 'Director')
      .map(jt => jt.crew!)
      .map(item => ({ ...item, type: 'director' } satisfies Token));

    const genres = movie.genres_on_movies
      .filter(jt => jt.genres)
      .map(jt => jt.genres!)
      .map(item => ({ ...item, type: 'genre' } satisfies Token));

    const streamers = movie.streamers_on_movies
      .filter(jt => jt.streamers)
      .map(jt => jt.streamers!)
      .map(item => ({ ...item, type: 'streamer' } satisfies Token));

    const budget = {
      id: movie.budget,
      name: moneyShort(movie.budget),
      type: 'budget',
    } satisfies Token;

    const revenue = {
      id: movie.revenue * 1000,
      name: moneyShort(movie.revenue * 1000),
      type: 'revenue',
    } satisfies Token;

    const runtime = {
      id: movie.runtime,
      name: `${movie.runtime} mins`,
      type: 'runtime',
    } satisfies Token;

    const year = {
      id: Number(getYear(movie.release_date)),
      name: getYear(movie.release_date),
      type: 'year',
    } satisfies Token;

    return {
      ...pick(movie, ['id', 'imdb_id', 'poster_path', 'release_date', 'tagline', 'title']),
      episode: pick(episode, ['episode_order', 'id', 'spotify_url']),
      actors: actors.slice(0, 3),
      actorIds: actors.map(a => a.id),
      budget,
      directors,
      genres,
      hosts,
      revenue,
      runtime,
      streamers,
      year,
    };
  });

  return movies;
};
