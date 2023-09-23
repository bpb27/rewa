import { pick } from 'remeda';
import Database from 'better-sqlite3';
import movieJson from '../scraping/jsonstuff/movies.json';
import episodesJson from '../scraping/jsonstuff/episodes.json';
import streamersJson from '../scraping/jsonstuff/streamers.json';
import streamersOnMoviesJson from '../scraping/jsonstuff/providers.json';
import { MoviesJson, EpisodesJson } from './types';
import {
  creatProductionCompaniesSql,
  createActorsOnMoviesTableSql,
  createActorsTableSql,
  createCrewOnMoviesSql,
  createCrewTableSql,
  createEpisodesTableSql,
  createGenresOnMoviesTableSql,
  createGenresTableSql,
  createHostsOnEpisodesSql,
  createHostsTableSql,
  createMoviesTableSql,
  createProductionCompaniesOnMoviesSql,
  createStreamersOnMoviesTable,
  createStreamersTableSql,
} from './create-tables';

const movies = movieJson as MoviesJson;
const episodes = episodesJson as EpisodesJson;
const streamers = streamersJson as {
  logo_path: string;
  provider_name: string;
  id: number;
}[];
const streamersOnMovies = streamersOnMoviesJson as {
  id: number;
  providers: string[];
}[];

const db = new Database('./prisma/db.sqlite', {
  readonly: false,
  timeout: 5000,
  // verbose: console.log,
});

const insert = (table: string, fields: string[]) =>
  `
    INSERT OR IGNORE INTO ${table} (
        ${fields.join(',')}
    ) VALUES (
        ${fields.map(f => '@' + f).join(',')}
    )
`;

// db.pragma('journal_mode = WAL');

// primary tables
db.prepare(createMoviesTableSql).run();
db.prepare(createActorsTableSql).run();
db.prepare(createCrewTableSql).run();
db.prepare(createGenresTableSql).run();
db.prepare(creatProductionCompaniesSql).run();
db.prepare(createStreamersTableSql).run();
db.prepare(createEpisodesTableSql).run();
db.prepare(createHostsTableSql).run();
// join tables
db.prepare(createActorsOnMoviesTableSql).run();
db.prepare(createCrewOnMoviesSql).run();
db.prepare(createGenresOnMoviesTableSql).run();
db.prepare(createProductionCompaniesOnMoviesSql).run();
db.prepare(createStreamersOnMoviesTable).run();
db.prepare(createHostsOnEpisodesSql).run();

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

const insertStreamer = db.prepare(insert('streamers', ['tmdb_id', 'name', 'logo_path']));

const insertStreamerOnMovie = db.prepare(
  insert('streamers_on_movies', ['streamer_id', 'movie_id'])
);

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

const getStreamerByName = db.prepare<string>(`
  SELECT id AS streamer_id FROM streamers WHERE name = ?;
`);

const insertMovies = db.transaction((movies: MoviesJson) => {
  for (const movie of movies) {
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

    // EPISODES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const episode = episodes.find(e => e.movieId === moviePayload.tmdb_id);
    if (episode) {
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
    }

    // STREAMERS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    for (const streamer of streamers) {
      const streamerPayload = {
        tmdb_id: streamer.id,
        logo_path: streamer.logo_path,
        name: streamer.provider_name,
      };
      insertStreamer.run(streamerPayload);
    }

    // STREAMERS_ON_MOVIE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const soms = streamersOnMovies.find(s => s.id === moviePayload.tmdb_id)?.providers;

    if (soms) {
      for (const streamerName of soms) {
        const { streamer_id } = getStreamerByName.get(streamerName) as {
          streamer_id: number;
        };
        if (streamer_id) {
          const streamerOnMoviePayload = { movie_id, streamer_id };
          insertStreamerOnMovie.run(streamerOnMoviePayload);
        }
      }
    }
  }
});

insertMovies(movies);

db.close();
