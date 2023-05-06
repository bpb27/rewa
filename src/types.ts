export type StaticProps<T extends () => any> = Awaited<ReturnType<T>>['props'];

export type MoviesJson = Movie[];
export type EpisodesJson = Episode[];

interface Movie {
  adult: boolean;
  backdrop_path: string;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  release_date: string;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  credits: Credits;
  // fields below are part of the movie JSON but should be omitted
  spoken_languages: any;
  production_countries: any;
  belongs_to_collection: any;
}

interface Genre {
  id: number;
  name: string;
}

interface ProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

interface Credits {
  cast: Cast[];
  crew: Crew[];
}

interface Cast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

interface Crew {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path?: string;
  credit_id: string;
  department: string;
  job: string;
}

type Episode = {
  id: number;
  title: string;
  hosts: string[];
  date: string;
  url: string;
  movieId: number;
};

export const relevantProviders = [
  'Netflix',
  'Amazon Prime Video',
  'Disney Plus',
  'Apple TV',
  'Hulu',
  'HBO Max',
  'Paramount Plus',
  'Starz',
  'Showtime',
] as const;

export type Streamer = (typeof relevantProviders)[number];
export type ProviderJson = { id: number; providers: Streamer[] }[];
