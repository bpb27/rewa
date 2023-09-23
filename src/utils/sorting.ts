import { type Movie } from '~/components/movie-table-page';
import { SortKey } from '~/data/query-params';

const sortFns = Object.freeze({
  budget: (m: Movie) => m.budget.id,
  director: (m: Movie) => m.directors[0]?.name,
  episodeNumber: (m: Movie) => m.episode.episode_order,
  profit: (m: Movie) => {
    const budget = m.budget.id;
    const revenue = m.revenue.id;
    if (!budget || !revenue) return 0;
    return (revenue - budget) / budget;
  },
  release_date: (m: Movie) => m.release_date,
  revenue: (m: Movie) => m.revenue.id,
  runtime: (m: Movie) => m.runtime.id,
  title: (m: Movie) => m.title,
} satisfies { [k: string]: (m: Movie) => string | number });

const sortOptions = [
  { value: 'title', label: 'Title' },
  { value: 'release_date', label: 'Year' },
  { value: 'episodeNumber', label: 'Episode' },
  { value: 'runtime', label: 'Runtime' },
  { value: 'revenue', label: 'Box Office' },
  { value: 'budget', label: 'Budget' },
  { value: 'profit', label: 'Profit %' },
  { value: 'director', label: 'Director' },
] satisfies { value: SortKey; label: string }[];

export const sortingUtils = { options: sortOptions, fns: sortFns };

const isoRegExp = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;

type SortableObject = {
  [key: string]: string | number | undefined | null | object;
};

export const smartSort = <TEntry extends SortableObject>(
  arr: TEntry[],
  getter: (item: TEntry) => any,
  asc: boolean
): TEntry[] => {
  const sorted = arr.sort((a: TEntry, b: TEntry) => {
    const aValue = getter(a);
    const bValue = getter(b);
    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      if (isoRegExp.test(aValue) && isoRegExp.test(bValue)) {
        return Date.parse(aValue) - Date.parse(bValue);
      } else {
        return aValue.localeCompare(bValue);
      }
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      return aValue - bValue;
    } else {
      return 0;
    }
  });
  return asc ? sorted : sorted.reverse();
};

export const sortByDate = (a: string, b: string) => Date.parse(a) - Date.parse(b);
