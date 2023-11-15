import { type Database } from 'better-sqlite3';
import { z } from 'zod';
import { type TableName } from './general';
import {
  getActorByTmdbId,
  getCrewByTmdbId,
  getEpisodeByUrl,
  getGenreByName,
  getHostByName,
  getKeywordByName,
  getMovieByTmdbId,
  getProductionCompanyByTmdbId,
} from './select';
import { tmdbApi } from './tmdb-api';

// NB: prisma can't handle lots of inserts, so need to use better-sqlite

const insertSchema = z.object({
  actor: z.object({
    gender: z.number(),
    name: z.string(),
    profile_path: z.string().optional(),
    tmdb_id: z.number(),
  }),
  actors_on_movie: z.object({
    actor_id: z.number(),
    character: z.string(),
    credit_id: z.string(),
    credit_order: z.number(),
    movie_id: z.number(),
  }),
  crew: z.object({
    gender: z.number(),
    name: z.string(),
    profile_path: z.string().optional(),
    tmdb_id: z.number(),
  }),
  crew_on_movie: z.object({
    credit_id: z.string(),
    crew_id: z.number(),
    department: z.string(),
    job: z.string(),
    known_for_department: z.string(),
    movie_id: z.number(),
  }),
  ebert_review: z.object({
    movie_id: z.number(),
    path: z.string(),
    rating: z.number(),
  }),
  episode: z.object({
    date: z.string(),
    episode_order: z.number(),
    movie_id: z.number(),
    spotify_url: z.string(),
    title: z.string(),
  }),
  genre: z.object({
    name: z.string(),
  }),
  genres_on_movie: z.object({
    genre_id: z.number(),
    movie_id: z.number(),
  }),
  host: z.object({
    name: z.string(),
  }),
  hosts_on_episode: z.object({
    episode_id: z.number(),
    host_id: z.number(),
  }),
  keyword: z.object({
    name: z.string(),
  }),
  keywords_on_movie: z.object({
    keyword_id: z.number(),
    movie_id: z.number(),
  }),
  movie: z.object({
    budget: z.number(),
    imdb_id: z.string(),
    overview: z.string(),
    poster_path: z.string(),
    release_date: z.string(),
    revenue: z.number(),
    runtime: z.number(),
    tagline: z.string(),
    title: z.string(),
    tmdb_id: z.number(),
  }),
  oscars_award: z.object({
    name: z.string(),
    category_id: z.number(),
  }),
  oscars_category: z.object({
    name: z.string(),
    relevance: z.string(),
  }),
  oscars_nomination: z.object({
    award_id: z.number(),
    ceremony_year: z.number(),
    film_year: z.number(),
    actor_id: z.number().nullable(),
    crew_id: z.number().nullable(),
    movie_id: z.number(),
    recipient: z.string(),
    won: z.number(),
  }),
  production_company: z.object({
    logo_path: z.string().optional(),
    name: z.string(),
    tmdb_id: z.number(),
  }),
  production_companies_on_movie: z.object({
    movie_id: z.number(),
    production_company_id: z.number(),
  }),
  streamers_on_movie: z.object({
    movie_id: z.number(),
    streamer_id: z.number(),
  }),
});

type InsertSchema = z.infer<typeof insertSchema>;

export const buildInsertSql = (table: TableName, fields: (string | number)[]) =>
  `
    INSERT OR IGNORE INTO ${table} (
        ${fields.join(',')}
    ) VALUES (
        ${fields.map(f => '@' + f).join(',')}
    )
`;

export const prepareInsert = (db: Database) => {
  const getFields = <TField extends keyof (typeof insertSchema)['shape']>(field: TField) =>
    insertSchema.shape[field].keyof().options;

  return {
    actor: db.prepare<InsertSchema['actor']>(buildInsertSql('actors', getFields('actor'))),
    actorsOnMovie: db.prepare<InsertSchema['actors_on_movie']>(
      buildInsertSql('actors_on_movies', getFields('actors_on_movie'))
    ),
    crew: db.prepare<InsertSchema['crew']>(buildInsertSql('crew', getFields('crew'))),
    crewOnMovie: db.prepare<InsertSchema['crew_on_movie']>(
      buildInsertSql('crew_on_movies', getFields('crew_on_movie'))
    ),
    ebert_review: db.prepare<InsertSchema['ebert_review']>(
      buildInsertSql('ebert_reviews', getFields('ebert_review'))
    ),
    episode: db.prepare<InsertSchema['episode']>(buildInsertSql('episodes', getFields('episode'))),
    genre: db.prepare<InsertSchema['genre']>(buildInsertSql('genres', getFields('genre'))),
    genresOnMovie: db.prepare<InsertSchema['genres_on_movie']>(
      buildInsertSql('genres_on_movies', getFields('genres_on_movie'))
    ),
    host: db.prepare<InsertSchema['host']>(buildInsertSql('hosts', getFields('host'))),
    hostsOnEpisode: db.prepare<InsertSchema['hosts_on_episode']>(
      buildInsertSql('hosts_on_episodes', getFields('hosts_on_episode'))
    ),
    keyword: db.prepare<InsertSchema['keyword']>(buildInsertSql('keywords', getFields('keyword'))),
    keywordsOnMovie: db.prepare<InsertSchema['keywords_on_movie']>(
      buildInsertSql('keywords_on_movies', getFields('keywords_on_movie'))
    ),
    movie: db.prepare<InsertSchema['movie']>(buildInsertSql('movies', getFields('movie'))),
    oscarAward: db.prepare<InsertSchema['oscars_award']>(
      buildInsertSql('oscars_awards', getFields('oscars_award'))
    ),
    oscarCategory: db.prepare<InsertSchema['oscars_category']>(
      buildInsertSql('oscars_categories', getFields('oscars_category'))
    ),
    oscarNomination: db.prepare<InsertSchema['oscars_nomination']>(
      buildInsertSql('oscars_nominations', getFields('oscars_nomination'))
    ),
    productionCompany: db.prepare<InsertSchema['production_company']>(
      buildInsertSql('production_companies', getFields('production_company'))
    ),
    productionCompaniesOnMovie: db.prepare<InsertSchema['production_companies_on_movie']>(
      buildInsertSql('production_companies_on_movies', getFields('production_companies_on_movie'))
    ),
    streamerOnMovie: db.prepare<InsertSchema['streamers_on_movie']>(
      buildInsertSql('streamers_on_movies', getFields('streamers_on_movie'))
    ),
  };
};

// NB: insert.run only returns the id if it actually inserts a row
// but does / returns nothing if the row already exists
// which means we need to refetch by tmdb_id after inserting

export const insertNewMovie = async (
  db: Database,
  parsedMovie: ReturnType<(typeof tmdbApi)['parseMovieById']>
) => {
  const inserter = prepareInsert(db);

  // add movie
  inserter.movie.run(parsedMovie.movie);
  const insertedMovie = await getMovieByTmdbId(parsedMovie.movie.tmdb_id);
  if (!insertedMovie) throw new Error('Failed to get movie');
  const movie_id = insertedMovie.id;

  // add actors
  parsedMovie.actors.forEach(actor => {
    inserter.actor.run(actor);
  });
  const insertedActors = await Promise.all(
    parsedMovie.actors.map(actor => getActorByTmdbId(actor.tmdb_id))
  );
  parsedMovie.actors.forEach(actor => {
    const actor_id = insertedActors.find(a => a?.tmdb_id === actor.tmdb_id)?.id;
    if (!actor_id) throw new Error('Failed to get actor');
    inserter.actorsOnMovie.run({ actor_id, movie_id, ...actor });
  });

  // add crew
  parsedMovie.crew.forEach(crew => {
    inserter.crew.run(crew);
  });
  const insertedCrew = await Promise.all(
    parsedMovie.crew.map(crew => getCrewByTmdbId(crew.tmdb_id))
  );
  parsedMovie.crew.forEach(crew => {
    const crew_id = insertedCrew.find(c => c?.tmdb_id === crew.tmdb_id)?.id;
    if (!crew_id) throw new Error('Failed to get crew');
    inserter.crewOnMovie.run({ crew_id, movie_id, ...crew });
  });

  // add production companies
  parsedMovie.productionCompanies.forEach(pc => {
    inserter.productionCompany.run(pc);
  });
  const insertedCompanies = await Promise.all(
    parsedMovie.productionCompanies.map(pc => getProductionCompanyByTmdbId(pc.tmdb_id))
  );
  parsedMovie.productionCompanies.forEach(pc => {
    const production_company_id = insertedCompanies.find(c => c?.tmdb_id === pc.tmdb_id)?.id;
    if (!production_company_id) throw new Error('Failed to get company');
    inserter.productionCompaniesOnMovie.run({ production_company_id, movie_id });
  });

  // add genres
  parsedMovie.genres.forEach(genre => {
    inserter.genre.run(genre);
  });
  const insertedGenres = await Promise.all(
    parsedMovie.genres.map(genre => getGenreByName(genre.name))
  );
  parsedMovie.genres.forEach(genre => {
    const genre_id = insertedGenres.find(g => g?.name === genre.name)?.id;
    if (!genre_id) throw new Error('Failed to get genre');
    inserter.genresOnMovie.run({ genre_id, movie_id });
  });

  // add keywords
  parsedMovie.keywords.forEach(keyword => {
    inserter.keyword.run(keyword);
  });
  const insertedKeywords = await Promise.all(
    parsedMovie.keywords.map(keyword => getKeywordByName(keyword.name))
  );
  parsedMovie.keywords.forEach(keyword => {
    const keyword_id = insertedKeywords.find(g => g?.name === keyword.name)?.id;
    if (!keyword_id) throw new Error('Failed to get keyword');
    inserter.keywordsOnMovie.run({ keyword_id, movie_id });
  });
};

export const insertNewEpisode = async (
  db: Database,
  episode: {
    date: string;
    episode_order: number;
    hosts: string[];
    spotify_url: string;
    title: string;
    tmdb_id: number;
  }
) => {
  const inserter = prepareInsert(db);

  const movie = await getMovieByTmdbId(episode.tmdb_id);
  if (!movie) throw new Error('Failed to get movie');

  // add episode
  inserter.episode.run({ ...episode, movie_id: movie.id });
  const insertedEpisode = await getEpisodeByUrl(episode.spotify_url);
  if (!insertedEpisode) throw new Error('Failed to get episode');

  // add hosts
  episode.hosts.forEach(host => {
    inserter.host.run({ name: host });
  });

  // add hosts on episode
  const insertedHosts = await Promise.all(episode.hosts.map(host => getHostByName(host)));
  episode.hosts.forEach(host => {
    const host_id = insertedHosts.find(a => a?.name === host)?.id;
    if (!host_id) throw new Error('Failed to get host');
    inserter.hostsOnEpisode.run({ host_id, episode_id: insertedEpisode.id });
  });
};

export const insertNewEbert = async (
  db: Database,
  review: {
    rating: number;
    path: string;
    tmdb_id: number;
  }
) => {
  const inserter = prepareInsert(db);
  const movie = await getMovieByTmdbId(review.tmdb_id);
  if (!movie) throw new Error('Failed to get movie');
  inserter.ebert_review.run({ ...review, movie_id: movie.id });
};
