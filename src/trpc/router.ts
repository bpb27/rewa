import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { z } from 'zod';
import { getActorRole, getActorRoleParams } from '~/apik/get-actor-role';
import { getLeaderboard, getLeaderboardParams } from '~/apik/get-leaderboard';
import { getMovieCast, getMovieCastParams } from '~/apik/get-movie-cast';
import { getMovieCrew, getMovieCrewParams } from '~/apik/get-movie-crew';
import { getMovies } from '~/apik/get-movies';
import { getOscarCategories } from '~/apik/get-oscar-categories';
import { getOscarsByYear, getOscarsByYearParams } from '~/apik/get-oscars-by-year';
import { getTokens } from '~/apik/get-tokens';
import { searchTokens, searchTokensParams } from '~/apik/search-tokens';
import { defaultQps, parsedQpSchema } from '~/data/query-params';
import { tmdbApi } from '../../scripts/tmbd-api';
import { procedure, router } from './trpc';

export const appRouter = router({
  getActorRole: procedure.input(getActorRoleParams).query(async ({ input }) => {
    return getActorRole(input);
  }),
  getLeaderboard: procedure.input(getLeaderboardParams).query(async ({ input }) => {
    const [people, tokens] = await Promise.all([getLeaderboard(input), getTokens(input.params)]);
    return { ...people, tokens };
  }),
  getMovie: procedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const { results } = await getMovies({ ...defaultQps, movieMode: 'any', movie: [input.id] });
    return results[0];
  }),
  getMovies: procedure.input(parsedQpSchema).query(async ({ input }) => {
    const [movies, tokens] = await Promise.all([getMovies(input), getTokens(input)]);
    return { ...movies, tokens };
  }),
  getMoviesFromTmdb: procedure
    .input(
      z.object({
        sortBy: z.enum(['vote_count', 'revenue']),
        year: z.union([z.string(), z.number()]),
      })
    )
    .query(async ({ input }) => {
      return tmdbApi.getMoviesBy(input);
    }),
  getMovieCast: procedure.input(getMovieCastParams).query(async ({ input }) => {
    return getMovieCast(input);
  }),
  getMovieCrew: procedure.input(getMovieCrewParams).query(async ({ input }) => {
    return getMovieCrew(input);
  }),
  getOscarCategories: procedure.query(async () => {
    return getOscarCategories();
  }),
  getOscarsByYear: procedure.input(getOscarsByYearParams).query(async ({ input }) => {
    return getOscarsByYear(input);
  }),
  getTokens: procedure.input(parsedQpSchema).query(async ({ input }) => {
    return getTokens(input);
  }),
  searchTokens: procedure.input(searchTokensParams).query(async ({ input }) => {
    return searchTokens(input);
  }),
});

export type AppRouter = typeof appRouter;
export type ApiResponses = inferRouterOutputs<AppRouter>;
export type ApiParams = inferRouterInputs<AppRouter>;
