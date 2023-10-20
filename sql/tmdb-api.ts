import { pick } from 'remeda';
import { relevantStreamers } from '../src/data/streamers';

const API_KEY = process.env.TMDB_API_KEY;

const getMovieById = async ({ tmdb_id }: { tmdb_id: number }) => {
  const route = `https://api.themoviedb.org/3/movie/${tmdb_id}?api_key=${API_KEY}&append_to_response=credits`;
  const response = await fetch(route);
  const movie = await response.json();
  return movie as Movie;
};

const getMovieKeywordsById = async ({ tmdb_id }: { tmdb_id: number }) => {
  const route = `https://api.themoviedb.org/3/movie/${tmdb_id}/keywords?api_key=${API_KEY}`;
  const response = await fetch(route);
  const keywords = await response.json();
  return keywords as { id: number; keywords: { id: number; name: string }[] };
};

const getMovieByName = async ({ name, year }: { name: string; year: number }) => {
  const filmName = encodeURI(name);
  const route = `https://api.themoviedb.org/3/search/movie?query=${filmName}&include_adult=false&language=en-US&page=1&api_key=${API_KEY}`;
  const response = await fetch(route);

  // TODO: move to separate parse func
  const { results, total_results } = (await response.json()) as {
    results: { id: number; release_date: string; title: string }[];
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
  return movie;
};

const getStreamersForMovie = async ({ tmdb_id }: { tmdb_id: number }) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${tmdb_id}/watch/providers?api_key=${API_KEY}`
  );
  const data = await response.json();
  const results = data?.results?.US?.flatrate as { provider_name: string }[];
  return (results || [])
    .filter(p => relevantStreamers.includes(p.provider_name))
    .map(p => p.provider_name);
};

const getTmdbIdByImdbId = async ({ imdb_id }: { imdb_id: string }) => {
  const findUrl = `https://api.themoviedb.org/3/find/${imdb_id}?api_key=${API_KEY}&external_source=imdb_id`;
  const response = await fetch(findUrl);
  const data = (await response.json()) as { movie_results: { id: number }[] };
  const tmdbId = data.movie_results[0]?.id;
  if (!tmdbId) throw new Error(`Failed to find ${imdb_id}`);
  return tmdbId;
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
  getMovieKeywordsById,
  getStreamersForMovie,
  getTmdbIdByImdbId,
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
