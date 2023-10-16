import { type NextApiHandler } from 'next';
import { getMovies, type GetMoviesResponse as GetMoviesApiResponse } from '~/api/get-movies';
import { getTokens, type GetTokensResponse } from '~/api/get-tokens';
import { qpSchema, type QpSchema } from '~/data/query-params';
import { apiError } from '~/utils/format';
import { type ApiError } from '~/utils/general-types';

export type ApiGetMoviesParams = QpSchema;
export type ApiGetMoviesResponse = GetMoviesApiResponse & GetTokensResponse;

const handler: NextApiHandler<ApiGetMoviesResponse | ApiError> = async (req, res) => {
  try {
    const params = qpSchema.parse(req.query);
    const [movies, tokens] = await Promise.all([getMovies(params), getTokens(params)]);
    res.status(200).json({ ...movies, ...tokens });
  } catch (e) {
    console.error(e);
    res.status(400).json(apiError('Failed to get movies', e));
  }
};

export default handler;
