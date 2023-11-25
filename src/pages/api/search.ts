import { type NextApiHandler } from 'next';
import { z } from 'zod';
import { searchTokens, type SearchTokensResponse } from '~/api/search-tokens';
import { qpSchema } from '~/data/query-params';
import { apiError } from '~/utils/format';
import { type ApiError } from '~/utils/general-types';

const paramsSchema = z.object({
  filter: qpSchema.shape.movieMode,
  search: z.string(),
});

export type ApiSearchParams = z.infer<typeof paramsSchema>;
export type ApiSearchResponse = SearchTokensResponse;

const handler: NextApiHandler<SearchTokensResponse | ApiError> = async (req, res) => {
  try {
    const params = paramsSchema.parse(req.query);
    const response = await searchTokens(params);
    res.status(200).json(response);
  } catch (e) {
    res.status(400).json(apiError('Failed to search', e));
  }
};

export default handler;
