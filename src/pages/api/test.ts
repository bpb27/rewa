import type { NextApiRequest, NextApiResponse } from 'next';
import { getOscarsByYear } from '~/apik/get-oscars-by-year';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await getOscarsByYear({ year: 1999 });
  res.status(200).json(response);
}
