import { newFormatDate } from '~/utils/format';
import { smartSort } from '~/utils/sorting';
import { kyselyDb } from '../../pg/db';
import { reusableSQL } from './reusable';

export const getRewaMoviesGroupedByYear = async () => {
  const response = await kyselyDb
    .selectFrom('movies')
    .select(['id', 'title', 'poster_path', 'release_date'])
    .where(reusableSQL.where.movieMode('rewa'))
    .execute();

  return response.reduce((hash, movie) => {
    const year = newFormatDate(movie.release_date, 'year');
    if (!hash[year]) hash[year] = [];
    hash[year].push({
      id: movie.id,
      title: movie.title,
      image: movie.poster_path,
      releaseDate: newFormatDate(movie.release_date, 'dash'),
    });
    hash[year] = smartSort(hash[year], m => m.releaseDate, 'asc');
    return hash;
  }, {} as Record<string, { id: number; title: string; image: string; releaseDate: string }[]>);
};
