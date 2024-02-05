import { z } from 'zod';
import { defaultQps } from '~/data/query-params';
import { getMovies } from './get-movies';

export const getMovieParams = z.object({
  id: z.number(),
});

export const getMovie = async (params: z.infer<typeof getMovieParams>) => {
  const response = await getMovies({ ...defaultQps, movie: [params.id], movieMode: 'any' });
  const [movie] = response.results;
  if (!movie) throw new Error('Not found');
  return movie;
};
