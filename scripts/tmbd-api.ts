import dotenvFlow from 'dotenv-flow';
import { z } from 'zod';

dotenvFlow.config();

const API_KEY = process.env.TMDB_API_KEY;

const movieSchema = z.object({
  budget: z.number(),
  genres: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
  id: z.number(),
  imdb_id: z.string(),
  keywords: z.object({
    keywords: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
      })
    ),
  }),
  overview: z.string(),
  popularity: z.number(),
  original_language: z.string(),
  poster_path: z.string(),
  production_companies: z.array(
    z.object({
      id: z.number(),
      logo_path: z.string().nullable(),
      name: z.string(),
    })
  ),
  production_countries: z.array(
    z.object({
      iso_3166_1: z.string(),
      name: z.string(),
    })
  ),
  release_date: z.string(),
  revenue: z.number(),
  runtime: z.number(),
  spoken_languages: z.array(
    z.object({
      iso_639_1: z.string(),
      name: z.string(),
    })
  ),
  tagline: z.string(),
  title: z.string(),
  vote_average: z.number(),
  vote_count: z.number(),
  credits: z.object({
    cast: z.array(
      z.object({
        gender: z.number(),
        id: z.number(),
        known_for_department: z.string(),
        name: z.string(),
        popularity: z.number(),
        profile_path: z.string().nullable(),
        character: z.string(),
        credit_id: z.string(),
        order: z.number(),
      })
    ),
    crew: z.array(
      z.object({
        gender: z.number(),
        id: z.number(),
        known_for_department: z.string(),
        name: z.string(),
        popularity: z.number(),
        profile_path: z.string().nullable(),
        credit_id: z.string(),
        department: z.string(),
        job: z.string(),
      })
    ),
  }),
});

const discoverMoviesSchema = z
  .object({
    page: z.number(),
    results: z
      .object({
        adult: z.boolean(),
        backdrop_path: z.string().nullable(),
        genre_ids: z.number().array(),
        id: z.number(),
        original_language: z.string(),
        original_title: z.string(),
        overview: z.string(),
        popularity: z.number(),
        poster_path: z.string().nullable(),
        release_date: z.string(),
        title: z.string(),
        video: z.boolean(),
        vote_average: z.number(),
        vote_count: z.number(),
      })
      .array(),
    total_pages: z.number(),
    total_results: z.number(),
  })
  .transform(({ results }) => {
    return results.map(m => ({
      tmdbId: m.id,
      name: m.title,
      image: m.poster_path,
      overview: m.overview,
      releaseDate: m.release_date,
    }));
  });

const streamerSchema = z.object({
  results: z.object({
    US: z.object({
      flatrate: z
        .array(
          z.object({
            provider_name: z.string(),
            logo_path: z.string(),
            provider_id: z.number(),
          })
        )
        .optional(),
    }),
  }),
});

type Params = { tmdbId: number };
const apiBase = 'https://api.themoviedb.org/3';

const getMovieById = async ({ tmdbId }: Params) => {
  const route = `${apiBase}/movie/${tmdbId}?append_to_response=credits,keywords&api_key=${API_KEY}`;
  const response = await fetch(route).then(response => response.json());
  return movieSchema.strip().parse(response);
};

const getMovieStreamers = async ({ tmdbId }: Params) => {
  const route = `${apiBase}/movie/${tmdbId}/watch/providers?api_key=${API_KEY}`;
  const response = await fetch(route).then(response => response.json());
  const parsed = streamerSchema.strip().parse(response);
  return parsed.results.US.flatrate || [];
};

const getMoviesBy = async ({
  sortBy,
  year,
}: {
  sortBy: 'vote_count' | 'revenue' | 'popularity';
  year: string | number;
}) => {
  const route = [
    `${apiBase}/discover/movie?`,
    'include_adult=false',
    'include_video=false',
    'language=en-US',
    'page=1',
    `primary_release_year=${year}`,
    `sort_by=${sortBy}.desc`,
    `api_key=${API_KEY}`,
  ].join('&');
  const response = await fetch(route).then(response => response.json());
  return discoverMoviesSchema.parse(response);
};

export const tmdbApi = { getMovieById, getMovieStreamers, getMoviesBy };
