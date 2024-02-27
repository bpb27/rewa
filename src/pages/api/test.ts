import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { getOscarsByYear } from '~/apik/get-oscars-by-year';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const currentDir = fs.readdirSync(path.join(process.cwd(), 'prisma'));
  const upOneDir = fs.readdirSync(path.join('..', process.cwd()));
  const upTwoDir = fs.readdirSync(path.join('..', process.cwd()));
  try {
    const response = await getOscarsByYear({ year: 1999 });
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ error: JSON.stringify(e), currentDir, upOneDir, upTwoDir });
  }
}
