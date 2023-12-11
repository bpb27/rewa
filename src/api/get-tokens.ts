import { isDefined } from 'remeda';
import { QpSchema, tokenKeys } from '~/data/query-params';
import {
  tokenize,
  tokenizeBudget,
  tokenizeBudgetGte,
  tokenizeBudgetLte,
  tokenizeOscarsCategoriesNom,
  tokenizeOscarsCategoriesWon,
  tokenizeRevenue,
  tokenizeRevenueGte,
  tokenizeRevenueLte,
  tokenizeRuntime,
  tokenizeRuntimeGte,
  tokenizeRuntimeLte,
  tokenizeYear,
  tokenizeYearGte,
  tokenizeYearLte,
} from '~/data/tokens';
import { Prisma } from '~/prisma';

const prisma = Prisma.getPrisma();

export type GetTokensResponse = Awaited<ReturnType<typeof getTokens>>;

export const getTokens = async (params: QpSchema) => {
  const response = await Promise.all(
    tokenKeys.map(key => {
      const ids = params[key] || [];
      if (!ids.length) return undefined;

      const findParams = {
        where: { id: { in: ids } },
        select: { id: true, name: true },
      };

      const callback = (
        results: ({ id: number; name: string } | { id: number; title: string })[]
      ) => results.map(item => tokenize(key, item));

      if (key === 'budget') return ids.map(tokenizeBudget);
      if (key === 'budgetGte') return ids.map(tokenizeBudgetGte);
      if (key === 'budgetLte') return ids.map(tokenizeBudgetLte);
      if (key === 'revenue') return ids.map(tokenizeRevenue);
      if (key === 'revenueGte') return ids.map(tokenizeRevenueGte);
      if (key === 'revenueLte') return ids.map(tokenizeRevenueLte);
      if (key === 'runtime') return ids.map(tokenizeRuntime);
      if (key === 'runtimeGte') return ids.map(tokenizeRuntimeGte);
      if (key === 'runtimeLte') return ids.map(tokenizeRuntimeLte);
      if (key === 'year') return ids.map(id => tokenizeYear(id.toString()));
      if (key === 'yearGte') return ids.map(id => tokenizeYearGte(id.toString()));
      if (key === 'yearLte') return ids.map(id => tokenizeYearLte(id.toString()));
      if (key === 'actor') return prisma.actors.findMany(findParams).then(callback);
      if (key === 'director') return prisma.crew.findMany(findParams).then(callback);
      if (key === 'producer') return prisma.crew.findMany(findParams).then(callback);
      if (key === 'writer') return prisma.crew.findMany(findParams).then(callback);
      if (key === 'cinematographer') return prisma.crew.findMany(findParams).then(callback);
      if (key === 'genre') return prisma.genres.findMany(findParams).then(callback);
      if (key === 'host') return prisma.hosts.findMany(findParams).then(callback);
      if (key === 'keyword') return prisma.keywords.findMany(findParams).then(callback);
      if (key === 'streamer') return prisma.streamers.findMany(findParams).then(callback);
      if (key === 'oscarsCategoriesNom')
        return prisma.oscars_categories
          .findMany(findParams)
          .then(cats => cats.map(c => tokenizeOscarsCategoriesNom(c.id, c.name)));
      if (key === 'oscarsCategoriesWon')
        return prisma.oscars_categories
          .findMany(findParams)
          .then(cats => cats.map(c => tokenizeOscarsCategoriesWon(c.id, c.name)));
      if (key === 'movie') {
        return prisma.movies
          .findMany({ where: { id: { in: ids } }, select: { title: true, id: true } })
          .then(callback);
      }
      // TODO: exhaustive check, maybe switch
    })
  );

  const tokens = response.flat().filter(isDefined);
  return { tokens };
};
