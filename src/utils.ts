export const tmdbImage = (path: string) =>
  `https://image.tmdb.org/t/p/original${path}`;

export const numberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

type GetByJobCrew = { job: string; name: string };
export const getByJob = (
  job: 'director' | 'producer' | 'writer' | 'cinematographer',
  crew: GetByJobCrew[]
): GetByJobCrew[] => {
  const matchesJob = {
    director: (crew: GetByJobCrew) => crew.job === 'Director',
    producer: (crew: GetByJobCrew) => crew.job === 'Producer',
    writer: (crew: GetByJobCrew) =>
      crew.job === 'Screenplay' || crew.job === 'Writer',
    cinematographer: (crew: GetByJobCrew) =>
      crew.job === 'Director of Photography' || crew.job === 'Cinematography',
  }[job];
  return crew.filter(matchesJob);
};

export const moneyShort = (x: number) => {
  const nwc = numberWithCommas(x).split(',');
  if (x >= 1000000000) {
    const decimal = `.${nwc[1].slice(0, 2)}`;
    return `$${nwc[0]}${decimal !== '.00' ? decimal : ''}b`;
  } else if (x >= 1000000) {
    const decimal = `.${nwc[1].slice(0, 1)}`;
    return `$${nwc[0]}${decimal !== '.0' ? decimal : ''}m`;
  } else {
    return `$${nwc[0]}k`;
  }
};

const isoRegExp = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;

type SortableObject = {
  [key: string]: string | number | undefined | null | object;
};

export const smartSort = <TEntry extends SortableObject>(
  arr: TEntry[],
  getter: (item: TEntry) => any
): TEntry[] => {
  return arr.sort((a: TEntry, b: TEntry) => {
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
};

export type HashUpsertContainer<
  TEntry extends { id: number },
  TMovie extends { id: number }
> = {
  [id: number]: {
    total: number;
    movies: TMovie[];
  } & TEntry;
};
export const hashUpsert = <
  TEntry extends { id: number },
  TMovie extends { id: number }
>(
  hash: HashUpsertContainer<TEntry, TMovie>,
  entry: TEntry,
  movie: TMovie
) => {
  if (hash[entry.id]) {
    if (!hash[entry.id].movies.find((m) => m.id === movie.id)) {
      hash[entry.id].total++;
      hash[entry.id].movies.push(movie);
    }
  } else {
    hash[entry.id] = {
      ...entry,
      total: 1,
      movies: [movie],
    };
  }
};

export const topOfHash = <THash extends { [k: number]: { total: number } }>(
  hash: THash,
  limit = 10
): THash[number][] => {
  return Object.values(hash)
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
};

export const moviePosterSize = (width: number) => ({
  width,
  height: Math.round(width * 1.66),
});

export const formatDate = (d: string) => {
  const split = d.split('-');
  return `${split[1]}/${split[2]}/${split[0]}`;
};

export const sortByDate = (a: string, b: string) =>
  Date.parse(a) - Date.parse(b);

export const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

import { useState, useEffect } from 'react';

export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
