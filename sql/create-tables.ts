export const createMoviesTableSql = `
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
`;

export const createActorsTableSql = `
CREATE TABLE IF NOT EXISTS actors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  gender INTEGER NOT NULL,
  tmdb_id INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  profile_path TEXT
);
`;

export const createActorsOnMoviesTableSql = `
CREATE TABLE IF NOT EXISTS actors_on_movies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  movie_id INTEGER NOT NULL,
  actor_id INTEGER NOT NULL,
  character TEXT NOT NULL,
  credit_id TEXT NOT NULL UNIQUE,
  credit_order INTEGER NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE,
  FOREIGN KEY (actor_id) REFERENCES actors (id) ON DELETE CASCADE
);
`;

export const createCrewTableSql = `
CREATE TABLE IF NOT EXISTS crew (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  gender INTEGER NOT NULL,
  tmdb_id INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  profile_path TEXT
);
`;

export const createCrewOnMoviesSql = `
CREATE TABLE IF NOT EXISTS crew_on_movies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  movie_id INTEGER NOT NULL,
  crew_id INTEGER NOT NULL,
  known_for_department TEXT NOT NULL,
  credit_id TEXT NOT NULL UNIQUE,
  department TEXT NOT NULL,
  job TEXT NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE,
  FOREIGN KEY (crew_id) REFERENCES crew (id) ON DELETE CASCADE
);
`;

export const createGenresTableSql = `
CREATE TABLE IF NOT EXISTS genres (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);
`;

export const createGenresOnMoviesTableSql = `
CREATE TABLE IF NOT EXISTS genres_on_movies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  movie_id INTEGER NOT NULL,
  genre_id INTEGER NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE,
  FOREIGN KEY (genre_id) REFERENCES genres (id) ON DELETE CASCADE,
  UNIQUE (movie_id, genre_id)
);
`;

export const creatProductionCompaniesSql = `
CREATE TABLE IF NOT EXISTS production_companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tmdb_id INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  logo_path TEXT
);
`;

export const createProductionCompaniesOnMoviesSql = `
CREATE TABLE IF NOT EXISTS production_companies_on_movies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  movie_id INTEGER NOT NULL,
  production_company_id INTEGER NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE,
  FOREIGN KEY (production_company_id) REFERENCES production_companies (id) ON DELETE CASCADE,
  UNIQUE (movie_id, production_company_id)
);
`;

export const createEpisodesTableSql = `
CREATE TABLE IF NOT EXISTS episodes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  episode_order INTEGER NOT NULL,
  date TEXT NOT NULL,
  spotify_url TEXT NOT NULL,
  movie_id INTEGER NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE
);
`;

export const createHostsTableSql = `
CREATE TABLE IF NOT EXISTS hosts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);
`;

export const createHostsOnEpisodesSql = `
CREATE TABLE IF NOT EXISTS hosts_on_episodes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  host_id INTEGER NOT NULL,
  episode_id INTEGER NOT NULL,
  FOREIGN KEY (host_id) REFERENCES hosts (id) ON DELETE CASCADE,
  FOREIGN KEY (episode_id) REFERENCES episodes (id) ON DELETE CASCADE,
  UNIQUE (host_id, episode_id)
);
`;

export const createStreamersTableSql = `
CREATE TABLE IF NOT EXISTS streamers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  tmdb_id INTEGER NOT NULL UNIQUE,
  logo_path TEXT
);
`;

export const createStreamersOnMoviesTable = `
CREATE TABLE IF NOT EXISTS streamers_on_movies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  movie_id INTEGER NOT NULL,
  streamer_id INTEGER NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE,
  FOREIGN KEY (streamer_id) REFERENCES streamers (id) ON DELETE CASCADE,
  UNIQUE (movie_id, streamer_id)
);
`;
