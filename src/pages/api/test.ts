import type { NextApiRequest, NextApiResponse } from 'next';
import { searchTokens } from '~/apik/search-tokens';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await searchTokens({ filter: 'rewa', search: 'something' });
  res.status(200).json(response);
}
