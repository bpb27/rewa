export const rankByTotalMovies = <TEntry extends { movies: any[] }>(
  people: TEntry[]
): (TEntry & { rank: number; ties: number })[] => {
  const sortedPeople = people.sort((a, b) => b.movies.length - a.movies.length);

  let rank = 0;
  let previousMovies = -1;
  let offset = 1;

  return sortedPeople
    .map(person => {
      if (person.movies.length !== previousMovies) {
        rank += offset;
        offset = 1; // reset offset
      } else {
        offset++; // increase offset if there's a tie
      }
      previousMovies = person.movies.length;

      return { ...person, rank };
    })
    .map(p => {
      const ties = people.filter(other => p.movies.length === other.movies.length).length;
      return { ...p, ties };
    });
};
