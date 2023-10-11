import { isDefined } from 'remeda';
import { Prisma } from '~/prisma';
import { QpSchema, tokenKeys } from '~/data/query-params';
import {
  tokenize,
  tokenizeBudget,
  tokenizeOscarCategory,
  tokenizeRevenue,
  tokenizeRuntime,
  tokenizeYear,
} from '~/data/tokens';

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
      if (key === 'revenue') return ids.map(tokenizeRevenue);
      if (key === 'runtime') return ids.map(tokenizeRuntime);
      if (key === 'year') return ids.map(id => tokenizeYear(id.toString()));
      if (key === 'actor') return prisma.actors.findMany(findParams).then(callback);
      if (key === 'director') return prisma.crew.findMany(findParams).then(callback);
      if (key === 'genre') return prisma.genres.findMany(findParams).then(callback);
      if (key === 'host') return prisma.hosts.findMany(findParams).then(callback);
      if (key === 'streamer') return prisma.streamers.findMany(findParams).then(callback);
      if (key === 'oscarCategory')
        return prisma.oscars_categories
          .findMany(findParams)
          .then(cats => cats.map(c => tokenizeOscarCategory(c.id, c.name)));
      if (key === 'movie') {
        return prisma.movies
          .findMany({ where: { id: { in: ids } }, select: { title: true, id: true } })
          .then(callback);
      }
    })
  );

  const tokens = response.flat().filter(isDefined);
  return { tokens };
};
