import { connectToDb } from '../general';
import { insertNewEbert, insertNewEpisode, insertNewMovie } from '../insert';
import { tmdbApi } from '../tmdb-api';

// TODO: add keywords to getMovieById and insertNewMovie
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
    tmdb_id: 12150,
    title: 'Sea of Love',
    episode_order: 323,
    date: 'Dec 2023',
    spotify_url: 'https://open.spotify.com/episode/0h6l5Si3mLsQg80vyfGVU3?si=9d6952c59a0c422f',
    hosts: ['Bill Simmons', 'Chris Ryan', 'Wosny Lambre'],
    ebert: { rating: 3, path: '/reviews/sea-of-love-1989' },
  },
  {
    tmdb_id: 2105,
    title: 'American Pie',
    episode_order: 322,
    date: 'Nov 2023',
    spotify_url: 'https://open.spotify.com/episode/7kOnZui462foKfj6eIHhfH?si=8e34bee053f24896',
    hosts: ['Bill Simmons', 'Chris Ryan', 'Sean Fennessey'],
    ebert: { rating: 3, path: '/reviews/american-pie-1999' },
  },
  {
    tmdb_id: 787,
    title: 'Mr. and Mrs. Smith',
    episode_order: 321,
    date: 'Nov 2023',
    spotify_url: 'https://open.spotify.com/episode/6HXn5A4fybXTe5cRdU3ta8?si=38637b3320ce473b',
    hosts: ['Bill Simmons', 'Chris Ryan', 'Amanda Dobbins'],
    ebert: { rating: 3, path: '/reviews/mr-and-mrs-smith-2005' },
  },
];

run(newEps[2]);
