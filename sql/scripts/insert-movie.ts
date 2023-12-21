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
    tmdb_id: 5825,
    title: "National Lampoon's Christmas Vacation",
    episode_order: 325,
    date: 'Dec 2023',
    spotify_url: 'https://open.spotify.com/episode/3i034ysNAntAE0PsiRF6OB?si=885ee1a6c658498d',
    hosts: ['Bill Simmons', 'Chris Ryan', 'Sean Fennessey', 'Van Lathan'],
    ebert: { rating: 2, path: '/reviews/national-lampoons-christmas-vacation-1989' },
  },
];

run(newEps[0]);
