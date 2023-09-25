import Database from 'better-sqlite3';
import { createStreamersOnMoviesTable } from './create-tables';
import { relevantStreamers } from '../src/data/streamers';

const db = new Database('./prisma/db.sqlite', {
  readonly: false,
  timeout: 5000,
});

const insert = (table: string, fields: string[]) =>
  `
    INSERT OR IGNORE INTO ${table} (
        ${fields.join(',')}
    ) VALUES (
        ${fields.map(f => '@' + f).join(',')}
    )
`;

const getAllMovies = db.prepare(`
  SELECT id, tmdb_id, title FROM movies;
`);

const getAllStreamers = db.prepare(`
  SELECT id, name FROM streamers;
`);

const insertStreamerOnMovie = db.prepare(
  insert('streamers_on_movies', ['streamer_id', 'movie_id'])
);

async function getStreamersForMovie(id: number) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${process.env.TMDB_API_KEY}`
  );
  const data = await response.json();
  const results = data?.results?.US?.flatrate as { provider_name: string }[];
  return (results || [])
    .filter(p => relevantStreamers.includes(p.provider_name))
    .map(p => p.provider_name);
}

const run = async () => {
  const movies = getAllMovies.all() as {
    id: number;
    tmdb_id: number;
    title: string;
  }[];

  const allStreamers = getAllStreamers.all() as {
    id: number;
    name: string;
  }[];

  db.exec('DROP TABLE IF EXISTS streamers_on_movies');
  db.prepare(createStreamersOnMoviesTable).run();

  const add = async (i: number) => {
    const movie = movies[i];
    if (!movie) return;

    const streamers = await getStreamersForMovie(movie.tmdb_id);
    console.log('inserting for ', movie.title, streamers);

    streamers.forEach(streamer => {
      const streamer_id = allStreamers.find(s => s.name === streamer)?.id;
      if (streamer_id) {
        const streamerOnMoviePayload = { movie_id: movie.id, streamer_id };
        insertStreamerOnMovie.run(streamerOnMoviePayload);
      } else {
        console.error(`Missed adding ${streamer} on ${movie.title}`);
      }
    });

    setTimeout(() => add(i + 1), 200);
  };

  add(0);
};

run();
