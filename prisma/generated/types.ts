import type { ColumnType } from 'kysely';
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type actors = {
  id: Generated<number>;
  gender: number;
  tmdb_id: number;
  name: string;
  profile_path: string | null;
};
export type actors_on_movies = {
  id: Generated<number>;
  movie_id: number;
  actor_id: number;
  character: string;
  credit_id: string;
  credit_order: number;
};
export type actors_on_oscars = {
  id: Generated<number>;
  oscar_id: number;
  actor_id: number;
};
export type crew = {
  id: Generated<number>;
  gender: number;
  tmdb_id: number;
  name: string;
  profile_path: string | null;
};
export type crew_jobs = {
  id: Generated<number>;
  job: string;
  department: string;
};
export type crew_on_movies = {
  id: Generated<number>;
  movie_id: number;
  crew_id: number;
  job_id: number;
  credit_id: string;
};
export type crew_on_oscars = {
  id: Generated<number>;
  oscar_id: number;
  crew_id: number;
};
export type ebert_reviews = {
  id: Generated<number>;
  movie_id: number;
  rating: number;
  path: string | null;
};
export type episodes = {
  id: Generated<number>;
  title: string;
  episode_order: number;
  date: string;
  spotify_url: string;
  movie_id: number;
};
export type genres = {
  id: Generated<number>;
  name: string;
};
export type genres_on_movies = {
  id: Generated<number>;
  movie_id: number;
  genre_id: number;
};
export type hosts = {
  id: Generated<number>;
  name: string;
};
export type hosts_on_episodes = {
  id: Generated<number>;
  host_id: number;
  episode_id: number;
};
export type keywords = {
  id: Generated<number>;
  name: string;
};
export type keywords_on_movies = {
  id: Generated<number>;
  movie_id: number;
  keyword_id: number;
};
export type movies = {
  id: Generated<number>;
  budget: number;
  tmdb_id: number;
  imdb_id: string;
  overview: string;
  poster_path: string;
  release_date: string;
  revenue: number;
  runtime: number;
  tagline: string;
  title: string;
};
export type movies_with_computed_fields = {
  movie_id: number;
  budget: number;
  release_date: string;
  revenue: number;
  runtime: number;
  title: string;
  profit_percentage: number;
  episode_order: number;
  total_oscar_nominations: number;
  total_oscar_wins: number;
  ebert_rating: number;
};
export type oscars_awards = {
  id: Generated<number>;
  name: string;
  category_id: number;
};
export type oscars_categories = {
  id: Generated<number>;
  name: string;
  relevance: string;
};
export type oscars_nominations = {
  id: Generated<number>;
  film_year: number;
  ceremony_year: number;
  won: number;
  recipient: string;
  movie_id: number;
  award_id: number;
};
export type production_companies = {
  id: Generated<number>;
  tmdb_id: number;
  name: string;
  logo_path: string | null;
};
export type production_companies_on_movies = {
  id: Generated<number>;
  movie_id: number;
  production_company_id: number;
};
export type streamers = {
  id: Generated<number>;
  name: string;
  tmdb_id: number;
  logo_path: string | null;
};
export type streamers_on_movies = {
  id: Generated<number>;
  movie_id: number;
  streamer_id: number;
};
export type DB = {
  actors: actors;
  actors_on_movies: actors_on_movies;
  actors_on_oscars: actors_on_oscars;
  crew: crew;
  crew_jobs: crew_jobs;
  crew_on_movies: crew_on_movies;
  crew_on_oscars: crew_on_oscars;
  ebert_reviews: ebert_reviews;
  episodes: episodes;
  genres: genres;
  genres_on_movies: genres_on_movies;
  hosts: hosts;
  hosts_on_episodes: hosts_on_episodes;
  keywords: keywords;
  keywords_on_movies: keywords_on_movies;
  movies: movies;
  movies_with_computed_fields: movies_with_computed_fields;
  oscars_awards: oscars_awards;
  oscars_categories: oscars_categories;
  oscars_nominations: oscars_nominations;
  production_companies: production_companies;
  production_companies_on_movies: production_companies_on_movies;
  streamers: streamers;
  streamers_on_movies: streamers_on_movies;
};
