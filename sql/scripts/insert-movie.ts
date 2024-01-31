import { connectToDb } from '../general';
import { insertNewEbert, insertNewEpisode, insertNewMovie } from '../insert';
import { tmdbApi } from '../tmdb-api';

type Movie = {
  tmdb_id: number;
};

type Ebert = {
  ebert: { rating: number; path: string };
};

type Episode = {
  title: string;
  episode_order: number;
  date: string;
  spotify_url: string;
  hosts: string[];
};

const run = async (params: Movie | (Movie & Episode) | (Movie & Episode & Ebert)) => {
  const db = connectToDb();
  const { tmdb_id } = params;
  const parsedMovie = await tmdbApi.getMovieById({ tmdb_id }).then(tmdbApi.parseMovieById);

  db.transaction(async () => {
    await insertNewMovie(db, parsedMovie);
    if ('hosts' in params) await insertNewEpisode(db, params);
    if ('ebert' in params) await insertNewEbert(db, { ...params.ebert, tmdb_id });
  })();
};

const newEps = [
  {
    tmdb_id: 9008,
    title: 'The Insider',
    episode_order: 331,
    date: 'Jan 2023',
    spotify_url: 'https://open.spotify.com/episode/2wnlO2GLqJwoP1YskNEbLy?si=accc19179df644c0',
    hosts: ['Bill Simmons', 'Chris Ryan', 'Sean Fennessey'],
    ebert: { rating: 3.5, path: '/reviews/the-insider-1999' },
  },
];

run(newEps[0]);
