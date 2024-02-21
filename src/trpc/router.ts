import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { z } from 'zod';
import { getLeaderboard, getLeaderboardParams } from '~/api/get-leaderboard';
import { getOscarsByYear, getOscarsByYearParams } from '~/api/get-oscars-by-year';
import { getPerson, getPersonParams } from '~/api/get-person';
import { getMovies } from '~/apik/get-movies';
import { getOscarCategories } from '~/apik/get-oscar-categories';
import { getTokens } from '~/apik/get-tokens';
import { searchTokens, searchTokensParams } from '~/apik/search-tokens';
import { defaultQps, parsedQpSchema } from '~/data/query-params';
import { procedure, router } from './trpc';

export const appRouter = router({
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
  getOscarCategories: procedure.query(async () => {
    return getOscarCategories();
  }),
  getOscarsByYear: procedure.input(getOscarsByYearParams).query(async ({ input }) => {
    return getOscarsByYear(input);
  }),
  getPerson: procedure.input(getPersonParams).query(async ({ input }) => {
    return getPerson(input);
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
