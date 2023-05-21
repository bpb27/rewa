import Database from 'better-sqlite3';
import { NextApiRequest, NextApiResponse } from 'next';

const db = new Database('src/database/db.sqlite', {
  readonly: false,
  timeout: 5000,
  // verbose: console.log,
});

const getMovieById = db.prepare<number>(`
  SELECT id AS movie_id FROM movies WHERE id = ?;
`);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const response = getMovieById.get(1) as {
    movie_id: number;
  };
  res.status(200).json(response);
};

export default handler;
