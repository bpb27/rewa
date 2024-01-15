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
    tmdb_id: 103663,
  },
  // {
  //   tmdb_id: 87502,
  //   title: 'Flight',
  //   episode_order: 328,
  //   date: 'Jan 2023',
  //   spotify_url: 'https://open.spotify.com/episode/0qb8o0HGCry0hKA3sWFb9r?si=841dfebfbe9242d7',
  //   hosts: ['Bill Simmons', 'Chris Ryan', 'Van Lathan'],
  //   ebert: { rating: 4, path: '/reviews/flight-2012' },
  // },
];

run(newEps[0]);
