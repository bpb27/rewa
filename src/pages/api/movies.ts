import { type NextApiHandler } from 'next';
import { getMovies, type GetMoviesResponse as GetMoviesApiResponse } from '~/api/get-movies';
import { getTokens, type GetTokensResponse } from '~/api/get-tokens';
import { qpSchema } from '~/data/query-params';

export type ApiGetMoviesResponse = GetMoviesApiResponse & GetTokensResponse;

const handler: NextApiHandler<ApiGetMoviesResponse> = async (req, res) => {
  try {
    const params = qpSchema.parse(req.query);
    const [movies, tokens] = await Promise.all([getMovies(params), getTokens(params)]);
    res.status(200).json({ ...movies, ...tokens });
  } catch (e) {
    res.status(400);
  }
};

export default handler;
