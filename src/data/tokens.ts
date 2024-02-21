import { TokenType } from '~/data/query-params';
import { getYear, moneyShort, titleCase } from '~/utils/format';
import { crewIdToJob } from './crew-jobs';

export type Token = { type: TokenType; id: number; name: string };

// TODO: just one tokenize function that figures out the formatting

export const tokenize = (
  tokenType: TokenType,
  item: { id: number; name: string } | { id: number; title: string }
): Token => ({ type: tokenType, id: item.id, name: 'name' in item ? item.name : item.title });

export const tokenizeBudget = (budget: number): Token => ({
  id: budget,
  name: `${moneyShort(budget)}`,
  type: 'budget',
});

export const tokenizeBudgetGte = (budget: number): Token => ({
  id: budget,
  name: `> ${moneyShort(budget)} budget`,
  type: 'budgetGte',
});

export const tokenizeBudgetLte = (budget: number): Token => ({
  id: budget,
  name: `< ${moneyShort(budget)} budget`,
  type: 'budgetLte',
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
  id: revenue,
  name: `${moneyShort(revenue * 1000)}`, // NB: stored in DB as / 1000 due to BigInt shit
  type: 'revenue',
});

export const tokenizeRevenueGte = (revenue: number): Token => ({
  id: revenue,
  name: `> ${moneyShort(revenue * 1000)} Box Office`, // NB: stored in DB as / 1000 due to BigInt shit
  type: 'revenueGte',
});

export const tokenizeRevenueLte = (revenue: number): Token => ({
  id: revenue,
  name: `< ${moneyShort(revenue * 1000)} Box Office`, // NB: stored in DB as / 1000 due to BigInt shit
  type: 'revenueLte',
});

export const tokenizeRuntime = (runtime: number): Token => ({
  id: runtime,
  name: `${runtime} mins`,
  type: 'runtime',
});

export const tokenizeRuntimeGte = (runtime: number): Token => ({
  id: runtime,
  name: `> ${runtime} mins`,
  type: 'runtimeGte',
});

export const tokenizeRuntimeLte = (runtime: number): Token => ({
  id: runtime,
  name: `< ${runtime} mins`,
  type: 'runtimeLte',
});

export const tokenizeYear = (date: string): Token => ({
  id: Number(getYear(date)),
  name: getYear(date),
  type: 'year',
});

export const tokenizeYearGte = (date: string): Token => ({
  id: Number(getYear(date)),
  name: `> ${getYear(date)}`,
  type: 'yearGte',
});

export const tokenizeYearLte = (date: string): Token => ({
  id: Number(getYear(date)),
  name: `< ${getYear(date)}`,
  type: 'yearLte',
});

export const tokenizeCrew = (params: { id: number; name: string; job_id: number }): Token => ({
  id: params.id,
  name: params.name,
  type: crewIdToJob[params.job_id],
});
