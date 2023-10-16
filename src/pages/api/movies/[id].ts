import { type NextApiHandler } from 'next';
import { z } from 'zod';
import { getMovies, type GetMoviesResponse } from '~/api/get-movies';
import { getActorInMovie, type GetActorInMovieResponse } from '~/api/get-actor-in-movie';
import { defaultQps } from '~/data/query-params';
import { apiError } from '~/utils/format';
import { type ApiError } from '~/utils/general-types';
import { integer } from '~/utils/zschema';

export type ApiGetMovieParams = Pick<z.infer<typeof paramsSchema>, 'actorId'>;
export type ApiGetMovieResponse = GetMoviesResponse['movies'][number] & {
  actor: GetActorInMovieResponse | undefined;
};

const paramsSchema = z.object({
  id: integer,
  actorId: integer.optional(),
});

const handler: NextApiHandler<ApiGetMovieResponse | ApiError> = async (req, res) => {
  try {
    const params = paramsSchema.parse(req.query);
    const movieParams = { ...defaultQps, movie: [params.id] };
    const actorParams = { actorId: params.actorId!, movieId: params.id };
    const [moviesResponse, actor] = await Promise.all([
      getMovies(movieParams),
      params.actorId && getActorInMovie(actorParams),
    ]);
    const movie = moviesResponse.movies[0];
    if (!movie) throw new Error('Not found');
    res.status(200).json({ ...movie, actor: actor || undefined });
  } catch (e) {
    res.status(400).json(apiError('Failed to get movie', e));
  }
};

export default handler;
