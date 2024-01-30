import type { NextApiRequest, NextApiResponse } from 'next';
import { getTopOscarActors } from '~/api/get-top-oscar-actors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const stuff = await getTopOscarActors();
  res.status(200).json(stuff);
}
