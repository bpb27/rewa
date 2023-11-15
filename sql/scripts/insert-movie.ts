import { connectToDb } from '../general';
import { insertNewEbert, insertNewEpisode, insertNewMovie } from '../insert';
import { tmdbApi } from '../tmdb-api';

// TODO: add keywords to getMovieById and insertNewMovie
const run = async (
  movie: { tmdb_id: number },
  episode?: {
    date: string;
    episode_order: number;
    hosts: string[];
    spotify_url: string;
    title: string;
  },
  ebert?: {
    path: string;
    rating: number;
  }
) => {
  const db = connectToDb();
  const { tmdb_id } = movie;
  const parsedMovie = await tmdbApi.getMovieById({ tmdb_id }).then(tmdbApi.parseMovieById);

  db.transaction(async () => {
    await insertNewMovie(db, parsedMovie);
    if (episode) await insertNewEpisode(db, { ...episode, tmdb_id });
    if (ebert) await insertNewEbert(db, { ...ebert, tmdb_id });
  })();
};

const newEps = [
  {
    tmdb_id: 10750,
    title: 'Toy Soldiers',
    episode_order: 314,
    date: 'Oct 2023',
    spotify_url: 'https://open.spotify.com/episode/2YqDWGNsTPEIJg9FIehqRv?si=91dee57004054a7e',
    hosts: ['Bill Simmons', 'Kyle Brandt'],
    ebert: { rating: 1, path: '/reviews/toy-soldiers-1991' },
  },
  {
    tmdb_id: 0,
    title: 'They Live',
    episode_order: 315,
    date: 'Oct 2023',
    spotify_url: 'https://open.spotify.com/episode/1lwgDMm4yWNn6uw7l8NYev?si=a67a9ac3a93d49dd',
    hosts: ['Bill Simmons', 'Chris Ryan', 'Sean Fennessey'],
  },
  {
    tmdb_id: 0,
    title: 'So I Married an Axe Murderer',
    episode_order: 316,
    date: 'Oct 2023',
    spotify_url: 'https://open.spotify.com/episode/3ncayFQRg6bbPzYhFp9Nnx?si=0def6c65ef324e04',
    hosts: ['Bill Simmons', 'Chris Ryan', 'Sean Fennessey'],
    ebert: { rating: 2.5, path: '/reviews/so-i-married-an-axe-murderer-1993' },
  },
  {
    tmdb_id: 0,
    title: 'In the Line of Fire',
    episode_order: 317,
    date: 'Oct 2023',
    spotify_url: 'https://open.spotify.com/episode/1lUHaNts2F8kaUGsMWk9kr?si=25b73cf449e24187',
    hosts: ['Bill Simmons', 'Chris Ryan'],
    ebert: { rating: 3.5, path: '/reviews/in-the-line-of-fire-1993' },
  },
  {
    tmdb_id: 0,
    title: 'The Omen',
    episode_order: 318,
    date: 'Oct 2023',
    spotify_url: 'https://open.spotify.com/episode/6lpp4WkAfygMK2Qixw4yYE?si=a8d82e70155d45f8',
    hosts: ['Bill Simmons', 'Chris Ryan'],
    ebert: { rating: 2.5, path: '/reviews/the-omen-1976' },
  },
  {
    tmdb_id: 0,
    title: 'Robin Hood: Prince of Thieves',
    episode_order: 319,
    date: 'Nov 2023',
    spotify_url: 'https://open.spotify.com/episode/6tMprM4JFNHrIwAYTAT5dc?si=f67d5999bbfd4f3a',
    hosts: ['Bill Simmons', 'Chris Ryan', 'Van Lathan'],
    ebert: { rating: 2, path: '/reviews/robin-hood-prince-of-thieves-1991' },
  },
];

run(newEps[0]);
