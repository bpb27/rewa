import { groupBy } from 'remeda';

export const rankByTotalMovies = <TEntry extends { cumulativeCreditOrder?: number; movies: any[] }>(
  people: TEntry[],
  tieSorting: (a: TEntry, b: TEntry) => number
): (TEntry & { rank: number; ties: number })[] => {
  return Object.values(groupBy(people, p => p.movies.length))
    .sort((a, b) => b[0].movies.length - a[0].movies.length)
    .map((segment, i, arr) =>
      segment
        .map(person => ({
          ...person,
          rank: 1 + arr.slice(0, i).flat().length,
          ties: segment.length,
        }))
        .sort(tieSorting)
    )
    .flat()
    .sort((a, b) => a.rank - b.rank);
};
