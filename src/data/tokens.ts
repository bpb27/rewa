import { TokenType } from '~/data/query-params';
import { getYear, moneyShort, titleCase } from '~/utils/format';

export type Token = { type: TokenType; id: number; name: string };

// TODO: this should be able to handle all cases - use switch for special key handling
export const tokenize = (
  tokenType: TokenType,
  item: { id: number; name: string } | { id: number; title: string }
): Token => ({ type: tokenType, id: item.id, name: 'name' in item ? item.name : item.title });

export const tokenizeBudget = (budget: number): Token => ({
  id: budget,
  name: moneyShort(budget),
  type: 'budget',
});

export const tokenizeOscarsCategoriesNom = (id: number, name: string): Token => ({
  id,
  name: `Oscar Nom: ${titleCase(name)}`,
  type: 'oscarsCategoriesNom',
});

export const tokenizeOscarsCategoriesWon = (id: number, name: string): Token => ({
  id,
  name: `Oscar Won: ${titleCase(name)}`,
  type: 'oscarsCategoriesWon',
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

export const tokenizeYearRange = (year: number, symbol: '<' | '>'): Token => ({
  id: year,
  name: `${symbol} ${year}`,
  type: 'yearRange',
});
