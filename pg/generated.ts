import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Int8 = ColumnType<string, bigint | number | string, bigint | number | string>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Actors {
  gender: number;
  id: Generated<number>;
  name: string;
  popularity: number;
  profile_path: string | null;
  tmdb_id: number;
}

export interface ActorsOnMovies {
  actor_id: number;
  character: string;
  credit_id: string;
  credit_order: number;
  id: Generated<number>;
  movie_id: number;
}

export interface ActorsOnOscars {
  actor_id: number;
  id: Generated<number>;
  oscar_id: number;
}

export interface Countries {
  id: Generated<number>;
  name: string;
  short: string;
}

export interface Crew {
  gender: number;
  id: Generated<number>;
  name: string;
  popularity: number;
  profile_path: string | null;
  tmdb_id: number;
}

export interface CrewJobs {
  department: string;
  id: Generated<number>;
  job: string;
}

export interface CrewOnMovies {
  credit_id: string;
  crew_id: number;
  id: Generated<number>;
  job_id: number;
  movie_id: number;
}

export interface CrewOnOscars {
  crew_id: number;
  id: Generated<number>;
  oscar_id: number;
}

export interface EbertReviews {
  id: Generated<number>;
  movie_id: number;
  path: string | null;
  rating: number;
}

export interface Episodes {
  date: string;
  episode_order: number;
  id: Generated<number>;
  movie_id: number;
  spotify_url: string;
  title: string;
}

export interface Genres {
  id: Generated<number>;
  name: string;
}

export interface GenresOnMovies {
  genre_id: number;
  id: Generated<number>;
  movie_id: number;
}

export interface Hosts {
  id: Generated<number>;
  name: string;
}

export interface HostsOnEpisodes {
  episode_id: number;
  host_id: number;
  id: Generated<number>;
}

export interface Keywords {
  id: Generated<number>;
  name: string;
}

export interface KeywordsOnMovies {
  id: Generated<number>;
  keyword_id: number;
  movie_id: number;
}

export interface Languages {
  id: Generated<number>;
  name: string;
  short: string;
}

export interface Movies {
  budget: Int8;
  id: Generated<number>;
  imdb_id: string;
  language_id: number;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: Timestamp;
  revenue: Int8;
  runtime: number;
  tagline: string;
  title: string;
  tmdb_id: number;
  vote_average: number;
  vote_count: number;
}

export interface OscarsAwards {
  category_id: number;
  id: Generated<number>;
  name: string;
}

export interface OscarsCategories {
  id: Generated<number>;
  name: string;
  relevance: string;
}

export interface OscarsNominations {
  award_id: number;
  ceremony_year: number;
  film_year: number;
  id: Generated<number>;
  movie_id: number;
  recipient: string;
  won: boolean;
}

export interface ProductionCompanies {
  id: Generated<number>;
  logo_path: string | null;
  name: string;
  tmdb_id: number;
}

export interface ProductionCompaniesOnMovies {
  id: Generated<number>;
  movie_id: number;
  production_company_id: number;
}

export interface ProductionCountriesOnMovies {
  country_id: number;
  id: Generated<number>;
  movie_id: number;
}

export interface SpokenLanguagesOnMovies {
  id: Generated<number>;
  language_id: number;
  movie_id: number;
}

export interface Streamers {
  id: Generated<number>;
  logo_path: string | null;
  name: string;
  tmdb_id: number;
}

export interface StreamersOnMovies {
  id: Generated<number>;
  movie_id: number;
  streamer_id: number;
}

export interface DB {
  actors: Actors;
  actors_on_movies: ActorsOnMovies;
  actors_on_oscars: ActorsOnOscars;
  countries: Countries;
  crew: Crew;
  crew_jobs: CrewJobs;
  crew_on_movies: CrewOnMovies;
  crew_on_oscars: CrewOnOscars;
  ebert_reviews: EbertReviews;
  episodes: Episodes;
  genres: Genres;
  genres_on_movies: GenresOnMovies;
  hosts: Hosts;
  hosts_on_episodes: HostsOnEpisodes;
  keywords: Keywords;
  keywords_on_movies: KeywordsOnMovies;
  languages: Languages;
  movies: Movies;
  oscars_awards: OscarsAwards;
  oscars_categories: OscarsCategories;
  oscars_nominations: OscarsNominations;
  production_companies: ProductionCompanies;
  production_companies_on_movies: ProductionCompaniesOnMovies;
  production_countries_on_movies: ProductionCountriesOnMovies;
  spoken_languages_on_movies: SpokenLanguagesOnMovies;
  streamers: Streamers;
  streamers_on_movies: StreamersOnMovies;
}
