const { omit, pick } = require('remeda');
const Database = require('better-sqlite3');
const movieJson = require('../src/db/movies.json');

interface Movie {
  budget: number;
  id: number;
  imdb_id: string;
  overview: string;
  poster_path: string;
  release_date: string;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  title: string;
  genres: {
    name: string;
  }[];
  production_companies: {
    id: number;
    name: string;
    tmdb_id: number;
    logo_path?: string;
  }[];
  credits: {
    cast: {
      gender: number;
      id: number;
      name: string;
      profile_path?: string;
      character: string;
      credit_id: string;
      order: number;
    }[];
    crew: {
      gender: number;
      id: number;
      known_for_department: string;
      name: string;
      profile_path?: string;
      credit_id: string;
      department: string;
      job: string;
    }[];
  };
}

const movies = movieJson as Movie[];

const db = new Database('./db.sqlite', {
  readonly: false,
  timeout: 5000,
  // verbose: console.log,
});

db.pragma('journal_mode = WAL');

// TODO: release_date should be a date
db.prepare(
  `
CREATE TABLE IF NOT EXISTS movies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  budget INTEGER NOT NULL,
  tmdb_id INTEGER NOT NULL UNIQUE,
  imdb_id TEXT NOT NULL UNIQUE,
  overview TEXT NOT NULL,
  poster_path TEXT NOT NULL,
  release_date TEXT NOT NULL,
  revenue INTEGER NOT NULL,
  runtime INTEGER NOT NULL,
  tagline TEXT NOT NULL,
  title TEXT NOT NULL
)
`
).run();

db.prepare(
  `
CREATE TABLE IF NOT EXISTS actors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  gender INTEGER NOT NULL,
  tmdb_id INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  profile_path TEXT
);
`
).run();

db.prepare(
  `
CREATE TABLE IF NOT EXISTS actors_on_movies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  movie_id INTEGER,
  actor_id INTEGER,
  character TEXT NOT NULL,
  credit_id TEXT NOT NULL UNIQUE,
  credit_order INTEGER NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE,
  FOREIGN KEY (actor_id) REFERENCES actors (id) ON DELETE CASCADE,
  UNIQUE (movie_id, actor_id)
);
`
).run();

db.prepare(
  `
CREATE TABLE IF NOT EXISTS crew (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  gender INTEGER NOT NULL,
  tmdb_id INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  profile_path TEXT
);
`
).run();

db.prepare(
  `
CREATE TABLE IF NOT EXISTS crew_on_movies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  movie_id INTEGER,
  crew_id INTEGER,
  known_for_department TEXT NOT NULL,
  credit_id TEXT NOT NULL UNIQUE,
  department TEXT NOT NULL,
  job TEXT NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE,
  FOREIGN KEY (crew_id) REFERENCES crew (id) ON DELETE CASCADE,
  UNIQUE (movie_id, crew_id)
);
`
).run();

db.prepare(
  `
CREATE TABLE IF NOT EXISTS genres (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);
`
).run();

db.prepare(
  `
CREATE TABLE IF NOT EXISTS genres_on_movies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  movie_id INTEGER,
  genre_id INTEGER,
  FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE,
  FOREIGN KEY (genre_id) REFERENCES genres (id) ON DELETE CASCADE,
  UNIQUE (movie_id, genre_id)
);
`
).run();

db.prepare(
  `
CREATE TABLE IF NOT EXISTS production_companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tmdb_id INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  logo_path TEXT
);
`
).run();

db.prepare(
  `
CREATE TABLE IF NOT EXISTS production_companies_on_movies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  movie_id INTEGER,
  production_company_id INTEGER,
  FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE,
  FOREIGN KEY (production_company_id) REFERENCES production_companies (id) ON DELETE CASCADE,
  UNIQUE (movie_id, production_company_id)
);
`
).run();

const insertMovie = db.prepare(`
  INSERT OR IGNORE INTO movies
  (
    budget,
    tmdb_id,
    imdb_id,
    overview,
    poster_path,
    release_date,
    revenue,
    runtime,
    tagline,
    title
  )
  VALUES (
    @budget,
    @tmdb_id,
    @imdb_id,
    @overview,
    @poster_path,
    @release_date,
    @revenue,
    @runtime,
    @tagline,
    @title
  )
`);

const insertGenre = db.prepare(`
  INSERT OR IGNORE INTO genres (name) VALUES (@name)
`);

const insertGenreOnMovie = db.prepare(`
  INSERT OR IGNORE INTO genres_on_movies (movie_id,genre_id) VALUES (@movie_id,@genre_id)
`);

const insertProductionCompany = db.prepare(`
  INSERT OR IGNORE INTO production_companies (
    name, tmdb_id, logo_path
  )
  VALUES (
    @name, @tmdb_id, @logo_path
  )
`);

const insertProductionCompanyOnMovie = db.prepare(`
  INSERT OR IGNORE INTO production_companies_on_movies (
    movie_id, production_company_id
  )
  VALUES (
    @movie_id, @production_company_id
  )
`);

const insertActor = db.prepare(`
  INSERT OR IGNORE INTO actors (
    gender,
    tmdb_id,
    name,
    profile_path
  )
  VALUES (
    @gender,
    @tmdb_id,
    @name,
    @profile_path
  )
`);

const insertActorOnMovie = db.prepare(`
  INSERT OR IGNORE INTO actors_on_movies (
    movie_id,
    actor_id,
    character,
    credit_id,
    credit_order
  )
  VALUES (
    @movie_id,
    @actor_id,
    @character,
    @credit_id,
    @credit_order
  )
`);

const insertCrew = db.prepare(`
  INSERT OR IGNORE INTO crew (
    gender,
    tmdb_id,
    name,
    profile_path
  )
  VALUES (
    @gender,
    @tmdb_id,
    @name,
    @profile_path
  )
`);

const insertCrewOnMovie = db.prepare(`
  INSERT OR IGNORE INTO crew_on_movies (
    movie_id,
    crew_id,
    known_for_department,
    credit_id,
    department,
    job
  )
  VALUES (
    @movie_id,
    @crew_id,
    @known_for_department,
    @credit_id,
    @department,
    @job
  )
`);

const getMovieByTmdbId = db.prepare(`
  SELECT id AS movie_id FROM movies WHERE tmdb_id = ?;
`);

const getGenreByName = db.prepare(`
  SELECT id AS genre_id FROM genres WHERE name = ?;
`);

const getCompanyByTmdbId = db.prepare(`
  SELECT id AS production_company_id FROM production_companies WHERE tmdb_id = ?;
`);

const getActorByTmdbId = db.prepare(`
  SELECT id AS actor_id FROM actors WHERE tmdb_id = ?;
`);

const getCrewByTmdbId = db.prepare(`
  SELECT id AS crew_id FROM crew WHERE tmdb_id = ?;
`);

const insertMovies = db.transaction((movies: Movie[]) => {
  for (const movie of movies) {
    const moviePayload = omit(movie, [
      'credits',
      'genres',
      'production_companies',
    ]);
    insertMovie.run(moviePayload);
    const { movie_id } = getMovieByTmdbId.get(moviePayload.tmdb_id);

    for (const genre of movie.genres) {
      const genrePayload = pick(genre, ['name']);
      insertGenre.run(genrePayload);
      const { genre_id } = getGenreByName.get(genrePayload.name);
      insertGenreOnMovie.run({ movie_id, genre_id });
    }

    for (const company of movie.production_companies) {
      const companyPayload = {
        ...pick(company, ['name', 'logo_path']),
        tmdb_id: company.id,
      };
      insertProductionCompany.run(companyPayload);
      const { production_company_id } = getCompanyByTmdbId.get(
        companyPayload.tmdb_id
      );
      insertProductionCompanyOnMovie.run({ movie_id, production_company_id });
    }

    for (const actor of movie.credits.cast) {
      const actorPayload = {
        ...pick(actor, ['gender', 'name', 'profile_path']),
        tmdb_id: actor.id,
      };
      insertActor.run(actorPayload);
      const { actor_id } = getActorByTmdbId.get(actorPayload.tmdb_id);
      const actorOnMoviePayload = {
        actor_id,
        movie_id,
        character: actor.character,
        credit_id: actor.credit_id,
        credit_order: actor.order,
      };
      insertActorOnMovie.run(actorOnMoviePayload);
    }

    for (const crew of movie.credits.crew) {
      const crewPayload = {
        ...pick(crew, ['gender', 'name', 'profile_path']),
        tmdb_id: crew.id,
      };
      insertCrew.run(crewPayload);
      const { crew_id } = getCrewByTmdbId.get(crewPayload.tmdb_id);
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
  }
});

insertMovies(
  movies.map((movie) => ({
    ...pick(movie, [
      'budget',
      'credits',
      'genres',
      'production_companies',
      'imdb_id',
      'overview',
      'poster_path',
      'release_date',
      'revenue',
      'runtime',
      'tagline',
      'title',
    ]),
    tmdb_id: movie.id,
  }))
);

db.close();
