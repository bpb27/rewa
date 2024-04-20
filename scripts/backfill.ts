import dotenvFlow from 'dotenv-flow';
import { writeFileSync } from 'fs';
import { range } from 'remeda';
import { tmdbApi } from './tmbd-api';

dotenvFlow.config();

const fetchYear = async (year: number) => {
  const popular = await tmdbApi
    .getMoviesBy({ sortBy: 'vote_count', year })
    .then(movies => movies.map((movie, i) => ({ ...movie, popularity: i + 1, revenue: 0, year })));

  const boxOffice = await tmdbApi
    .getMoviesBy({ sortBy: 'revenue', year })
    .then(movies => movies.map((movie, i) => ({ ...movie, revenue: i + 1, popularity: 0, year })));

  const response = [...popular, ...boxOffice].reduce((hash, movie) => {
    const target = hash[movie.tmdbId];

    if (!target) return { ...hash, [movie.tmdbId]: movie };

    if (hash[movie.tmdbId].popularity === 0) {
      target.popularity = movie.popularity;
    }
    if (hash[movie.tmdbId].revenue === 0) {
      target.revenue = movie.revenue;
    }

    return { ...hash, [movie.tmdbId]: target };
  }, {} as Record<number, (typeof popular)[number] & (typeof boxOffice)[number]>);

  return response;
};

const run = async () => {
  const years = range(1950, 2024);
  const data: unknown[] = [];

  for (let year of years) {
    try {
      console.log('fetching', year);
      const yearData = await fetchYear(year);
      data.push(yearData);
    } catch (e) {
      console.log('failed', year, e);
    }
  }

  writeFileSync('./pg/json/top-year-movies.json', JSON.stringify(data));
};

run();
