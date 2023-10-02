import { SortKey } from '~/data/query-params';

export const sortOptions = [
  { value: 'title', label: 'Title' },
  { value: 'release_date', label: 'Year' },
  { value: 'episodeNumber', label: 'Episode' },
  { value: 'runtime', label: 'Runtime' },
  { value: 'revenue', label: 'Box Office' },
  { value: 'budget', label: 'Budget' },
  { value: 'profit', label: 'Profit %' },
  { value: 'director', label: 'Director' },
  { value: 'total_oscar_nominations', label: 'Oscar noms' },
  { value: 'total_oscar_wins', label: 'Oscar wins' },
] satisfies { value: SortKey; label: string }[];

const longDateRegEx = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;
const shortDateRegEx = /^\d{4}-\d{2}-\d{2}$/;
const isDateString = (str: string) => longDateRegEx.test(str) || shortDateRegEx.test(str);

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
      if (isDateString(aValue) && isDateString(bValue)) {
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

export const withinYearRange = (one: string | number, two: string | number): boolean =>
  Math.abs(Number(one.toString().slice(0, 4)) - Number(two.toString().slice(0, 4))) <= 5;
