import { relations } from 'drizzle-orm';
import { integer, numeric, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const movies = sqliteTable('movies', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  budget: integer('budget').notNull(),
  tmdbId: integer('tmdb_id').notNull(),
  imdbId: text('imdb_id').notNull(),
  overview: text('overview').notNull(),
  posterPath: text('poster_path').notNull(),
  releaseDate: text('release_date').notNull(),
  revenue: integer('revenue').notNull(),
  runtime: integer('runtime').notNull(),
  tagline: text('tagline').notNull(),
  title: text('title').notNull(),
});

export const actors = sqliteTable('actors', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  gender: integer('gender').notNull(),
  tmdbId: integer('tmdb_id').notNull(),
  name: text('name').notNull(),
  profilePath: text('profile_path'),
});

export const crew = sqliteTable('crew', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  gender: integer('gender').notNull(),
  tmdbId: integer('tmdb_id').notNull(),
  name: text('name').notNull(),
  profilePath: text('profile_path'),
});

export const genres = sqliteTable('genres', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
});

export const productionCompanies = sqliteTable('production_companies', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tmdbId: integer('tmdb_id').notNull(),
  name: text('name').notNull(),
  logoPath: text('logo_path'),
});

export const streamers = sqliteTable('streamers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  tmdbId: integer('tmdb_id').notNull(),
  logoPath: text('logo_path'),
});

export const episodes = sqliteTable('episodes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  episodeOrder: integer('episode_order').notNull(),
  date: text('date').notNull(),
  spotifyUrl: text('spotify_url').notNull(),
  movieId: integer('movie_id')
    .notNull()
    .references(() => movies.id, { onDelete: 'cascade' }),
});

export const hosts = sqliteTable('hosts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
});

export const actorsOnMovies = sqliteTable('actors_on_movies', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  movieId: integer('movie_id')
    .notNull()
    .references(() => movies.id, { onDelete: 'cascade' }),
  actorId: integer('actor_id')
    .notNull()
    .references(() => actors.id, { onDelete: 'cascade' }),
  character: text('character').notNull(),
  creditId: text('credit_id').notNull(),
  creditOrder: integer('credit_order').notNull(),
});

export const crewOnMovies = sqliteTable('crew_on_movies', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  movieId: integer('movie_id')
    .notNull()
    .references(() => movies.id, { onDelete: 'cascade' }),
  crewId: integer('crew_id')
    .notNull()
    .references(() => crew.id, { onDelete: 'cascade' }),
  knownForDepartment: text('known_for_department').notNull(),
  creditId: text('credit_id').notNull(),
  department: text('department').notNull(),
  job: text('job').notNull(),
});

export const genresOnMovies = sqliteTable('genres_on_movies', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  movieId: integer('movie_id')
    .notNull()
    .references(() => movies.id, { onDelete: 'cascade' }),
  genreId: integer('genre_id')
    .notNull()
    .references(() => genres.id, { onDelete: 'cascade' }),
});

export const productionCompaniesOnMovies = sqliteTable('production_companies_on_movies', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  movieId: integer('movie_id')
    .notNull()
    .references(() => movies.id, { onDelete: 'cascade' }),
  productionCompanyId: integer('production_company_id')
    .notNull()
    .references(() => productionCompanies.id, { onDelete: 'cascade' }),
});

export const hostsOnEpisodes = sqliteTable('hosts_on_episodes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  hostId: integer('host_id')
    .notNull()
    .references(() => hosts.id, { onDelete: 'cascade' }),
  episodeId: integer('episode_id')
    .notNull()
    .references(() => episodes.id, { onDelete: 'cascade' }),
});

export const oscarsNominations = sqliteTable('oscars_nominations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  filmYear: integer('film_year').notNull(),
  ceremonyYear: integer('ceremony_year').notNull(),
  won: numeric('won').notNull(),
  recipient: text('recipient').notNull(),
  movieId: integer('movie_id')
    .notNull()
    .references(() => movies.id, { onDelete: 'cascade' }),
  awardId: integer('award_id')
    .notNull()
    .references(() => oscarsAwards.id, { onDelete: 'cascade' }),
  actorId: integer('actor_id').references(() => actors.id, { onDelete: 'cascade' }),
  crewId: integer('crew_id').references(() => crew.id, { onDelete: 'cascade' }),
});

export const oscarsAwards = sqliteTable('oscars_awards', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  categoryId: integer('category_id')
    .notNull()
    .references(() => oscarsCategories.id, { onDelete: 'cascade' }),
});

export const oscarsCategories = sqliteTable('oscars_categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  relevance: text('relevance').notNull(),
});

export const keywords = sqliteTable('keywords', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
});

export const keywordsOnMovies = sqliteTable('keywords_on_movies', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  movieId: integer('movie_id')
    .notNull()
    .references(() => movies.id, { onDelete: 'cascade' }),
  keywordId: integer('keyword_id')
    .notNull()
    .references(() => keywords.id, { onDelete: 'cascade' }),
});

export const ebertReviews = sqliteTable('ebert_reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  movieId: integer('movie_id')
    .notNull()
    .references(() => movies.id, { onDelete: 'cascade' }),
  rating: real('rating').notNull(),
  path: text('path'),
});

export const streamersOnMovies = sqliteTable('streamers_on_movies', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  movieId: integer('movie_id')
    .notNull()
    .references(() => movies.id, { onDelete: 'cascade' }),
  streamerId: integer('streamer_id')
    .notNull()
    .references(() => streamers.id, { onDelete: 'cascade' }),
});

export const moviesRelations = relations(movies, ({ many }) => ({
  actors: many(actorsOnMovies),
  crew: many(crewOnMovies),
  genres: many(genresOnMovies),
  keywords: many(keywordsOnMovies),
  productionCompanies: many(productionCompaniesOnMovies),
  streamers: many(streamersOnMovies),
  oscarsNominations: many(oscarsNominations),
  episodes: many(episodes),
}));

export const genresOnMoviesRelations = relations(genresOnMovies, ({ one }) => ({
  movie: one(movies, { fields: [genresOnMovies.movieId], references: [movies.id] }),
  genre: one(genres, { fields: [genresOnMovies.genreId], references: [genres.id] }),
}));

export const actorsOnMoviesRelations = relations(actorsOnMovies, ({ one }) => ({
  movie: one(movies, { fields: [actorsOnMovies.movieId], references: [movies.id] }),
  actor: one(actors, { fields: [actorsOnMovies.actorId], references: [actors.id] }),
}));

export const crewOnMoviesRelations = relations(crewOnMovies, ({ one }) => ({
  movie: one(movies, { fields: [crewOnMovies.movieId], references: [movies.id] }),
  crew: one(crew, { fields: [crewOnMovies.crewId], references: [crew.id] }),
}));

export const keywordsOnMoviesRelations = relations(keywordsOnMovies, ({ one }) => ({
  movie: one(movies, { fields: [keywordsOnMovies.movieId], references: [movies.id] }),
  keyword: one(keywords, { fields: [keywordsOnMovies.keywordId], references: [keywords.id] }),
}));

export const streamersOnMoviesRelations = relations(streamersOnMovies, ({ one }) => ({
  movie: one(movies, { fields: [streamersOnMovies.movieId], references: [movies.id] }),
  streamer: one(streamers, { fields: [streamersOnMovies.streamerId], references: [streamers.id] }),
}));

export const productionCompaniesOnMoviesRelations = relations(
  productionCompaniesOnMovies,
  ({ one }) => ({
    movie: one(movies, { fields: [productionCompaniesOnMovies.movieId], references: [movies.id] }),
    productionCompanies: one(productionCompanies, {
      fields: [productionCompaniesOnMovies.productionCompanyId],
      references: [productionCompanies.id],
    }),
  })
);

export const oscarsNominationsRelations = relations(oscarsNominations, ({ one }) => ({
  award: one(oscarsAwards, {
    fields: [oscarsNominations.awardId],
    references: [oscarsAwards.id],
  }),
  movie: one(movies, {
    fields: [oscarsNominations.movieId],
    references: [movies.id],
  }),
}));

export const oscarsAwardsRelations = relations(oscarsAwards, ({ one }) => ({
  category: one(oscarsCategories, {
    fields: [oscarsAwards.categoryId],
    references: [oscarsCategories.id],
  }),
}));

export const episodeRelations = relations(episodes, ({ one }) => ({
  movie: one(movies, { fields: [episodes.movieId], references: [movies.id] }),
}));
