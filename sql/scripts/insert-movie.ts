import { connectToDb } from '../general';
import { insertNewEbert, insertNewEpisode, insertNewMovie } from '../insert';
import { tmdbApi } from '../tmdb-api';

const run = async (params: {
  tmdb_id: number;
  title: string;
  episode_order: number;
  date: string;
  spotify_url: string;
  hosts: string[];
  ebert?: { rating: number; path: string };
}) => {
  const db = connectToDb();
  const { tmdb_id } = params;
  const parsedMovie = await tmdbApi.getMovieById({ tmdb_id }).then(tmdbApi.parseMovieById);

  db.transaction(async () => {
    await insertNewMovie(db, parsedMovie);
    await insertNewEpisode(db, params);
    if (params.ebert) await insertNewEbert(db, { ...params.ebert, tmdb_id });
  })();
};

const newEps = [
  {
    tmdb_id: 9944,
    title: 'The Pelican Brief',
    episode_order: 324,
    date: 'Dec 2023',
    spotify_url: 'https://open.spotify.com/episode/6Bq0AFIKEgmfGRtLLWFJwn?si=7981ee3e95034232',
    hosts: ['Bill Simmons', 'Chris Ryan', 'Sean Fennessey', 'Amanda Dobbins'],
    ebert: { rating: 3, path: '/reviews/the-pelican-brief-1993' },
  },
];

run(newEps[0]);
