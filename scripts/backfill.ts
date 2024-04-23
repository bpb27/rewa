import { writeFileSync } from 'fs';
import data from '../pg/json/top-movies.json';

const run = async () => {
  const stuff = data.reduce(
    (hash, movie) => ({
      ...hash,
      [movie.tmdbId]: movie.revenue,
    }),
    {} as Record<number, number>
  );
  writeFileSync('./pg/json/top-movie-revenue-lookup.json', JSON.stringify(stuff));
};

run();
