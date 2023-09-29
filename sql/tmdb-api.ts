import { pick } from 'remeda';

const API_KEY = process.env.TMDB_API_KEY;

const getMovieById = async ({ tmdb_id }: { tmdb_id: number }) => {
  const route = `https://api.themoviedb.org/3/movie/${tmdb_id}?api_key=${API_KEY}&append_to_response=credits`;
  const response = await fetch(route);
  const movie = await response.json();
  return movie as Movie;
};

const getMovieByName = async ({ name, year }: { name: string; year: number }) => {
  const filmName = encodeURI(name);
  const route = `https://api.themoviedb.org/3/search/movie?query=${filmName}&include_adult=false&language=en-US&page=1&api_key=${API_KEY}`;
  const response = await fetch(route);

  // TODO: movie to parse
  const { results, total_results } = (await response.json()) as {
    results: { id: number; release_date: string }[];
    total_results: number;
  };

  if (!total_results) throw new Error(`Cant find ${name}`);
  const movie = results.find(r => {
    const matches = (y: number, offset: number) =>
      r.release_date.startsWith((y - offset).toString());
    return (
      matches(year, 0) ||
      matches(year, 1) ||
      matches(year, 2) ||
      matches(year, 3) ||
      matches(year, 4)
    );
  });
  if (!movie) throw new Error('Not found for that year');
  return getMovieById({ tmdb_id: movie.id });
};

const parseMovieById = (movie: Movie) => {
  return {
    movie: {
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
    },
    genres: movie.genres.map(genre => pick(genre, ['name'])),
    productionCompanies: movie.production_companies.map(c => ({
      ...pick(c, ['name', 'logo_path']),
      tmdb_id: c.id,
    })),
    actors: movie.credits.cast.map(a => ({
      ...pick(a, ['gender', 'name', 'profile_path', 'character', 'credit_id']),
      tmdb_id: a.id,
      credit_order: a.order,
    })),
    crew: movie.credits.crew.map(c => ({
      ...pick(c, [
        'gender',
        'name',
        'profile_path',
        'credit_id',
        'department',
        'known_for_department',
        'job',
      ]),
      tmdb_id: c.id,
    })),
  };
};

export const tmdbApi = {
  getMovieById,
  getMovieByName,
  parseMovieById,
};

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
