import Database from 'better-sqlite3';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

const projectRoot = process.cwd();
const dbPath = path.join(projectRoot, 'src/database/db.sqlite');
console.log(dbPath);
const db = new Database(dbPath, {
  readonly: false,
  timeout: 5000,
  // verbose: console.log,
});

const getMovieById = db.prepare<number>(`
  SELECT title FROM movies WHERE id = ?;
`);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const response = getMovieById.get(1);
  res.status(200).json(response);
};

export default handler;
