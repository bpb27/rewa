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

const topCategory = z.enum([
  'actor',
  'actorNoms',
  'director',
  'directorNoms',
  'cinematographer',
  'producer',
  'writer',
]);

export const appEnums = {
  movieMode: { schema: movieMode, values: movieMode._def.values },
  searchMode: { schema: searchMode, values: searchMode._def.values },
  sort: { schema: sort, values: sort._def.values },
  topCategory: { schema: topCategory, values: topCategory._def.values },
};

export type AppEnums = {
  [K in keyof typeof appEnums]: z.infer<(typeof appEnums)[K]['schema']>;
};
