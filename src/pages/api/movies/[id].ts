import { type NextApiHandler } from 'next';
import { z } from 'zod';
import { getMovies, type GetMoviesResponse } from '~/api/get-movies';
import { getActorInMovie, type GetActorInMovieResponse } from '~/api/get-actor-in-movie';
import { integer } from '~/utils/zschema';
import { defaultQps } from '~/data/query-params';

export type ApiGetMovieResponse = GetMoviesResponse['movies'][number] & {
  actor: GetActorInMovieResponse | undefined;
};

const paramsSchema = z.object({
  id: integer,
  actorId: integer.optional(),
});

const handler: NextApiHandler<ApiGetMovieResponse> = async (req, res) => {
  try {
    const params = paramsSchema.parse(req.query);
    const movieParams = { ...defaultQps, movie: [params.id] };
    const actorParams = { actorId: params.actorId!, movieId: params.id };
    const [moviesResponse, actor] = await Promise.all([
      getMovies(movieParams),
      params.actorId && getActorInMovie(actorParams),
    ]);
    const movie = moviesResponse.movies[0];
    res.status(200).json({ ...movie, actor: actor || undefined });
  } catch (e) {
    res.status(400);
  }
};

export default handler;
