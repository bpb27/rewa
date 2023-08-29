import { pick } from 'remeda';
import Database from 'better-sqlite3';
import { MoviesJson, EpisodesJson } from '../src/types';

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

const insertMovie = db.prepare(
  insert('movies', [
    'budget',
    'tmdb_id',
    'imdb_id',
    'overview',
    'poster_path',
    'release_date',
    'revenue',
    'runtime',
    'tagline',
    'title',
  ])
);

const insertGenre = db.prepare(insert('genres', ['name']));

const insertGenreOnMovie = db.prepare(insert('genres_on_movies', ['movie_id', 'genre_id']));

const insertProductionCompany = db.prepare(
  insert('production_companies', ['name', 'tmdb_id', 'logo_path'])
);

const insertProductionCompanyOnMovie = db.prepare(
  insert('production_companies_on_movies', ['movie_id', 'production_company_id'])
);

const insertActor = db.prepare(insert('actors', ['gender', 'tmdb_id', 'name', 'profile_path']));

const insertActorOnMovie = db.prepare(
  insert('actors_on_movies', ['movie_id', 'actor_id', 'character', 'credit_id', 'credit_order'])
);

const insertCrew = db.prepare(insert('crew', ['gender', 'tmdb_id', 'name', 'profile_path']));

const insertCrewOnMovie = db.prepare(
  insert('crew_on_movies', [
    'movie_id',
    'crew_id',
    'known_for_department',
    'credit_id',
    'department',
    'job',
  ])
);

const insertEpisode = db.prepare(
  insert('episodes', ['title', 'episode_order', 'date', 'spotify_url', 'movie_id'])
);

const insertHostOnEpisode = db.prepare(insert('hosts_on_episodes', ['host_id', 'episode_id']));

const insertHost = db.prepare(insert('hosts', ['name']));

const getMovieByTmdbId = db.prepare<number>(`
  SELECT id AS movie_id FROM movies WHERE tmdb_id = ?;
`);

const getGenreByName = db.prepare<string>(`
  SELECT id AS genre_id FROM genres WHERE name = ?;
`);

const getCompanyByTmdbId = db.prepare<number>(`
  SELECT id AS production_company_id FROM production_companies WHERE tmdb_id = ?;
`);

const getActorByTmdbId = db.prepare<number>(`
  SELECT id AS actor_id FROM actors WHERE tmdb_id = ?;
`);

const getCrewByTmdbId = db.prepare<number>(`
  SELECT id AS crew_id FROM crew WHERE tmdb_id = ?;
`);

const getHostByName = db.prepare<string>(`
  SELECT id AS host_id FROM hosts WHERE name = ?;
`);

const getEpisodeByUrl = db.prepare<string>(`
  SELECT id AS episode_id FROM episodes WHERE spotify_url = ?;
`);

const addMovieToDb = (
  movie: MoviesJson[number],
  episode: {
    id: number;
    title: string;
    hosts: string[];
    url: string;
    date: string;
  }
) =>
  db.transaction(() => {
    const moviePayload = {
      ...pick(movie, [
        'budget',
        'imdb_id',
        'overview',
        'poster_path',
        'release_date',
        'runtime',
        'tagline',
        'title',
      ]),
      tmdb_id: movie.id,
      revenue: movie.revenue / 1000,
    };
    insertMovie.run(moviePayload);
    const { movie_id } = getMovieByTmdbId.get(moviePayload.tmdb_id) as {
      movie_id: number;
    };

    // GENRES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    for (const genre of movie.genres) {
      const genrePayload = pick(genre, ['name']);
      insertGenre.run(genrePayload);
      const { genre_id } = getGenreByName.get(genrePayload.name) as {
        genre_id: number;
      };
      insertGenreOnMovie.run({ movie_id, genre_id });
    }

    // PROD COMPANIES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    for (const company of movie.production_companies) {
      const companyPayload = {
        ...pick(company, ['name', 'logo_path']),
        tmdb_id: company.id,
      };
      insertProductionCompany.run(companyPayload);
      const { production_company_id } = getCompanyByTmdbId.get(companyPayload.tmdb_id) as {
        production_company_id: number;
      };
      insertProductionCompanyOnMovie.run({ movie_id, production_company_id });
    }

    // ACTORS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    for (const actor of movie.credits.cast) {
      const actorPayload = {
        ...pick(actor, ['gender', 'name', 'profile_path']),
        tmdb_id: actor.id,
      };
      insertActor.run(actorPayload);
      const { actor_id } = getActorByTmdbId.get(actorPayload.tmdb_id) as {
        actor_id: number;
      };
      const actorOnMoviePayload = {
        actor_id,
        movie_id,
        character: actor.character,
        credit_id: actor.credit_id,
        credit_order: actor.order,
      };
      insertActorOnMovie.run(actorOnMoviePayload);
    }

    // CREW ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    for (const crew of movie.credits.crew) {
      const crewPayload = {
        ...pick(crew, ['gender', 'name', 'profile_path']),
        tmdb_id: crew.id,
      };
      insertCrew.run(crewPayload);
      const { crew_id } = getCrewByTmdbId.get(crewPayload.tmdb_id) as {
        crew_id: number;
      };
      const crewOnMoviePayload = {
        crew_id,
        movie_id,
        credit_id: crew.credit_id,
        department: crew.department,
        known_for_department: crew.known_for_department,
        job: crew.job,
      };
      insertCrewOnMovie.run(crewOnMoviePayload);
    }

    // EPISODE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    const episodePayload = {
      title: episode.title,
      episode_order: episode.id,
      date: episode.date,
      spotify_url: episode.url,
      movie_id,
    };
    insertEpisode.run(episodePayload);
    const { episode_id } = getEpisodeByUrl.get(episodePayload.spotify_url) as {
      episode_id: number;
    };

    for (const host of episode.hosts) {
      const hostPayload = { name: host };
      insertHost.run(hostPayload);
      const { host_id } = getHostByName.get(hostPayload.name) as {
        host_id: number;
      };
      const hostOnEpisodePayload = { host_id, episode_id };
      insertHostOnEpisode.run(hostOnEpisodePayload);
    }
  })();

const newStuff = [
  {
    tmdbId: 11153,
    id: 306,
    title: 'Vacation',
    hosts: ['Bill Simmons', 'Chris Ryan', 'Van Lathan'],
    date: 'Aug 2023',
    url: 'https://open.spotify.com/episode/0gPQ03lMHYxg9RBpHBtpUX?si=942b6a9db6324d4a',
  },
  {
    tmdbId: 345,
    id: 307,
    title: 'Eyes Wide Shut',
    hosts: ['Bill Simmons', 'Chris Ryan', 'Sean Fennessey', 'Mallory Rubin'],
    date: 'Aug 2023',
    url: 'https://open.spotify.com/episode/7wOXmBvBAsmclh3n9tozVv?si=8f21a5d4f3194fd4',
  },
  {
    tmdbId: 796,
    id: 308,
    title: 'Cruel Intentions',
    hosts: ['Bill Simmons', 'Juliet Litman', 'Amanda Dobbins'],
    date: 'Aug 2023',
    url: 'https://open.spotify.com/episode/5IOa9Mk8PvNzrWsJnrKaoJ?si=d565f3c79fec4e5b',
  },
  {
    tmdbId: 156022,
    id: 309,
    title: 'The Equalizer',
    hosts: ['Bill Simmons', 'Chris Ryan', 'Bill’s Dad'],
    date: 'Aug 2023',
    url: 'https://open.spotify.com/episode/3btBdwsf7wqnPA7JrGyPX6?si=ead9153a7e8143f7',
  },
];

const fetchFromTmdb = async () => {
  const { tmdbId, ...episode } = newStuff[3];
  const findUrl = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${process.env.TMDB_API_KEY}&append_to_response=credits`;
  const response = await fetch(findUrl);
  const movie = await response.json();
  const run = true;
  if (run) {
    addMovieToDb(movie, episode);
  } else {
    console.log('DRY RUN', movie);
  }
  db.close();
};

const run = async () => {
  try {
    await fetchFromTmdb();
  } catch (e) {
    console.log('well shit', e);
    db.close();
  }
};

run();
