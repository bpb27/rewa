import { AppEnums } from '~/utils/enums';
import { getYear, moneyShort, titleCase } from '~/utils/format';
import { jobIdToJobStr } from './crew-jobs';

// TODO: can remove most of this

export type Token = { type: AppEnums['token']; id: number; name: string };

export const tokenize = (
  tokenType: AppEnums['token'],
  item: { id: number; name: string }
): Token => ({
  type: tokenType,
  id: item.id,
  name: item.name,
});

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
  name: `${moneyShort(revenue)}`,
  type: 'revenue',
});

export const tokenizeRevenueGte = (revenue: number): Token => ({
  id: revenue,
  name: `> ${moneyShort(revenue)} Box Office`,
  type: 'revenueGte',
});

export const tokenizeRevenueLte = (revenue: number): Token => ({
  id: revenue,
  name: `< ${moneyShort(revenue)} Box Office`,
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
  type: jobIdToJobStr[params.job_id],
});
