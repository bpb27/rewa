import { z } from 'zod';
import { getYear, moneyShort } from '~/utils/format';

export type TokenType = z.infer<typeof tokenSchema>;
export type Token = { type: TokenType; id: number; name: string };

export const tokenSchema = z.enum([
  'actor',
  'budget',
  'director',
  'genre',
  'host',
  'movie',
  'revenue',
  'runtime',
  'streamer',
  'year',
]);

export const tokenize = (
  tokenType: TokenType,
  item: { id: number; name: string } | { id: number; title: string }
): Token => ({ type: tokenType, id: item.id, name: 'name' in item ? item.name : item.title });

export const tokenizeBudget = (budget: number): Token => ({
  id: budget,
  name: moneyShort(budget),
  type: 'budget',
});

export const tokenizeRevenue = (revenue: number): Token => ({
  id: revenue * 1000,
  name: moneyShort(revenue * 1000),
  type: 'revenue',
});

export const tokenizeRuntime = (runtime: number): Token => ({
  id: runtime,
  name: `${runtime} mins`,
  type: 'runtime',
});

export const tokenizeYear = (date: string): Token => ({
  id: Number(getYear(date)),
  name: getYear(date),
  type: 'year',
});
