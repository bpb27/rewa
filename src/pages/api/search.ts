import { type NextApiHandler } from 'next';
import { z } from 'zod';
import { searchTokens, type SearchTokensResponse } from '~/api/search-tokens';

const paramsSchema = z.object({
  search: z.string(),
});

export type ApiSearchResponse = SearchTokensResponse;

const handler: NextApiHandler<SearchTokensResponse> = async (req, res) => {
  try {
    const params = paramsSchema.parse(req.query);
    const response = await searchTokens(params);
    res.status(200).json(response);
  } catch (e) {
    res.status(400);
  }
};

export default handler;
