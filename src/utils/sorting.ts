import { uniqBy } from 'remeda';
import { Token } from '~/data/tokens';
import { AppEnums } from './enums';

export const sortOptions = [
  { value: 'title', label: 'Title' },
  { value: 'release_date', label: 'Year' },
  { value: 'episodeNumber', label: 'Episode' },
  { value: 'runtime', label: 'Runtime' },
  { value: 'revenue', label: 'Box Office' },
  { value: 'budget', label: 'Budget' },
  { value: 'popularity', label: 'Popularity (TMBD)' },
  { value: 'profit', label: 'Profit %' },
  { value: 'total_oscar_nominations', label: 'Oscar noms' },
  { value: 'total_oscar_wins', label: 'Oscar wins' },
  { value: 'ebert', label: 'Ebert rating' },
] satisfies { value: AppEnums['sort']; label: string }[];

export const oscarSortOptions = sortOptions.filter(
  option => !['episodeNumber', 'ebert'].includes(option.value)
);

const longDateRegEx = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;
const shortDateRegEx = /^\d{4}-\d{2}-\d{2}$/;
const isDateString = (str: string) => longDateRegEx.test(str) || shortDateRegEx.test(str);

type SortableObject = {
  [key: string]: string | number | undefined | null | object | boolean;
};

// TODO: expose inner methods here so they can be used in a sort function
export const smartSort = <TEntry extends SortableObject>(
  arr: TEntry[],
  getter: (item: TEntry) => any,
  order: 'asc' | 'desc' = 'asc'
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
  return order === 'asc' ? sorted : sorted.reverse();
};

export const sortByDate = (a: string, b: string) => Date.parse(a) - Date.parse(b);

export const withinYearRange = (one: string | number, two: string | number): boolean =>
  Math.abs(Number(one.toString().slice(0, 4)) - Number(two.toString().slice(0, 4))) <= 5;

const crewOrder = ['director', 'writer', 'cinematographer', 'producer'];
export const sortCrew = (a: Token, b: Token) => {
  return crewOrder.indexOf(a.type) - crewOrder.indexOf(b.type);
};

export const sortMovies = <T extends { id: number; releaseDate: string }>(movies: T[]) =>
  smartSort(
    uniqBy(movies, m => m.id),
    m => m.releaseDate,
    'asc'
  );

export const sortLeaderboard = <T extends { movies: any[] }>(leaderboard: T[]) =>
  smartSort(leaderboard, l => l.movies.length, 'desc');
