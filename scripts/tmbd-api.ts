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
  poster_path: z.string(),
  production_companies: z.array(
    z.object({
      id: z.number(),
      logo_path: z.string().nullable(),
      name: z.string(),
    })
  ),
  release_date: z.string(),
  revenue: z.number(),
  runtime: z.number(),
  tagline: z.string(),
  title: z.string(),
  credits: z.object({
    cast: z.array(
      z.object({
        gender: z.number(),
        id: z.number(),
        known_for_department: z.string(),
        name: z.string(),
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
        profile_path: z.string().nullable(),
        credit_id: z.string(),
        department: z.string(),
        job: z.string(),
      })
    ),
  }),
});

const streamerSchema = z.object({
  results: z.object({
    US: z.object({
      flatrate: z.array(
        z.object({
          provider_name: z.string(),
        })
      ),
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
  return parsed.results.US.flatrate.map(p => p.provider_name);
};

export const tmdbApi = { getMovieById, getMovieStreamers };
