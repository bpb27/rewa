import Database from "better-sqlite3";
import { createStreamersOnMoviesTable } from "./create-tables";

/*
  THIS script is inconsistent - not sure if it's API-related or DB-write related
*/

const db = new Database("./prisma/db.sqlite", {
  readonly: false,
  timeout: 5000,
});

const insert = (table: string, fields: string[]) =>
  `
    INSERT OR IGNORE INTO ${table} (
        ${fields.join(",")}
    ) VALUES (
        ${fields.map(f => "@" + f).join(",")}
    )
`;

const getAllMovies = db.prepare(`
  SELECT id, tmdb_id, title FROM movies;
`);

const getStreamerByName = db.prepare<string>(`
  SELECT id AS streamer_id FROM streamers WHERE name = ?;
`);

const relevantProviders = [
  "Netflix",
  "Amazon Prime Video",
  "Disney Plus",
  "Apple TV",
  "Hulu",
  "HBO Max",
  "Paramount Plus",
  "Starz",
  "Showtime",
];

async function getStreamersForMovie(id: number) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${process.env.TMDB_API_KEY}`
  );
  const data = await response.json();
  const results = data?.results?.US?.flatrate as { provider_name: string }[];
  return (results || [])
    .filter(p => relevantProviders.includes(p.provider_name))
    .map(p => p.provider_name);
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const run = async () => {
  db.exec("DROP TABLE IF EXISTS streamers_on_movies");
  db.prepare(createStreamersOnMoviesTable).run();
  const insertStreamerOnMovie = db.prepare(
    insert("streamers_on_movies", ["streamer_id", "movie_id"])
  );

  const movies = getAllMovies.all() as {
    id: number;
    tmdb_id: number;
    title: string;
  }[];

  movies.forEach(async (movie, i) => {
    await delay(250);
    const streamers = await getStreamersForMovie(movie.tmdb_id);
    console.log("inserting for ", movie.title, streamers);
    streamers.forEach(streamer => {
      const { streamer_id } = getStreamerByName.get(streamer) as {
        streamer_id: number;
      };
      if (streamer_id) {
        const streamerOnMoviePayload = { movie_id: movie.id, streamer_id };
        insertStreamerOnMovie.run(streamerOnMoviePayload);
      }
    });
  });
};

run();
