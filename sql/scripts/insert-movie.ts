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
    tmdb_id: 8845,
    title: 'Under Siege',
    episode_order: 326,
    date: 'Dec 2023',
    spotify_url: 'https://open.spotify.com/episode/1srWRyDzHSL4twwSFFDhqp?si=4464903272fa4ca0',
    hosts: ['Bill Simmons', 'Kyle Brandt'],
    ebert: { rating: 3, path: '/reviews/under-siege-1992' },
  },
  {
    tmdb_id: 14291,
    title: 'Searching for Bobby Fischer',
    episode_order: 327,
    date: 'Jan 2023',
    spotify_url: 'https://open.spotify.com/episode/0lZQW13TNkalG07ACHVliS?si=ea2d26c2b06f4864',
    hosts: ['Bill Simmons', 'Van Lathan', 'Charles Holmes'],
    ebert: { rating: 4, path: '/reviews/searching-for-bobby-fischer-1993' },
  },
  {
    tmdb_id: 87502,
    title: 'Flight',
    episode_order: 328,
    date: 'Jan 2023',
    spotify_url: 'https://open.spotify.com/episode/0qb8o0HGCry0hKA3sWFb9r?si=841dfebfbe9242d7',
    hosts: ['Bill Simmons', 'Chris Ryan', 'Van Lathan'],
    ebert: { rating: 4, path: '/reviews/flight-2012' },
  },
];

run(newEps[2]);
