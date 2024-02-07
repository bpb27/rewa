import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { getActor, getActorParams } from '~/api/get-actor';
import { getActorInMovie, getActorInMovieParams } from '~/api/get-actor-in-movie';
import { getLeaderboard, getLeaderboardParams } from '~/api/get-leaderboard';
import { getMovie, getMovieParams } from '~/api/get-movie';
import { getMovies } from '~/api/get-movies';
import { getOscarCategories } from '~/api/get-oscar-categories';
import { getOscarsByYear, getOscarsByYearParams } from '~/api/get-oscars-by-year';
import { getTokens } from '~/api/get-tokens';
import { searchTokens, searchTokensParams } from '~/api/search-tokens';
import { parsedQpSchema } from '~/data/query-params';
import { procedure, router } from './trpc';

export const appRouter = router({
  getActor: procedure.input(getActorParams).query(async ({ input }) => {
    return getActor(input);
  }),
  getActorInMovie: procedure.input(getActorInMovieParams).query(async ({ input }) => {
    return getActorInMovie(input);
  }),
  getLeaderboard: procedure.input(getLeaderboardParams).query(async ({ input }) => {
    const [people, { tokens }] = await Promise.all([
      getLeaderboard(input),
      getTokens(input.params),
    ]);
    return { ...people, tokens };
  }),
  getMovie: procedure.input(getMovieParams).query(async ({ input }) => {
    return getMovie(input);
  }),
  getMovies: procedure.input(parsedQpSchema).query(async ({ input }) => {
    const [movies, { tokens }] = await Promise.all([getMovies(input), getTokens(input)]);
    return { ...movies, tokens };
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
