import { insertNewEpisode, insertNewMovie } from './insert';
import { connectToDb } from './general';
import { tmdbApi } from './tmdb-api';

const run = async (
  movie: { tmdb_id: number },
  episode?: {
    date: string;
    episode_order: number;
    hosts: string[];
    spotify_url: string;
    title: string;
  }
) => {
  const db = connectToDb();
  const { tmdb_id } = movie;
  const parsedMovie = await tmdbApi.getMovieById({ tmdb_id }).then(tmdbApi.parseMovieById);

  db.transaction(async () => {
    await insertNewMovie(db, parsedMovie);
    if (episode) await insertNewEpisode(db, { ...episode, tmdb_id });
  })();
};

run(
  {
    tmdb_id: 9273, // big chill 12560
  }
  // {
  //   episode_order: 313, // big chill 313
  //   title: 'The Big Chill',
  //   hosts: ['Bill Simmons', 'Chris Ryan', 'Sean Fennessey'],
  //   date: 'Sep 2023',
  //   spotify_url: 'https://open.spotify.com/episode/7CtvLizEy93PgVMhAIiyi6?si=6a18e5ef102f414a',
  // }
);
