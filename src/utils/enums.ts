import { z } from 'zod';

const movieMode = z.enum(['rewa', 'oscar', 'any']);

const searchMode = z.enum(['and', 'or']);

const sort = z.enum([
  'budget',
  'director',
  'ebert',
  'episodeNumber',
  'profit',
  'release_date',
  'revenue',
  'runtime',
  'title',
  'total_oscar_nominations',
  'total_oscar_wins',
]);

const topCategory = z.enum(['actor', 'director', 'cinematographer', 'producer', 'writer']);

const topCategorySub = z.enum(['mostFilms', 'mostNoms', 'mostWins']);

const oscarWon = z.enum(['both', 'won', 'nominated']);

const actorNomAward = z.enum(['both', 'lead', 'supporting']);

export const appEnums = {
  movieMode: { schema: movieMode, values: movieMode._def.values },
  oscarActorAward: { schema: actorNomAward, values: actorNomAward._def.values },
  oscarWon: { schema: oscarWon, values: oscarWon._def.values },
  searchMode: { schema: searchMode, values: searchMode._def.values },
  sort: { schema: sort, values: sort._def.values },
  topCategory: { schema: topCategory, values: topCategory._def.values },
  topCategorySub: { schema: topCategorySub, values: topCategorySub._def.values },
};

export type AppEnums = {
  [K in keyof typeof appEnums]: z.infer<(typeof appEnums)[K]['schema']>;
};
