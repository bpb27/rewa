import Database from 'better-sqlite3';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

// const dbPath = path.join(process.cwd(), 'database/db.sqlite');

// const db = new Database(dbPath, {
//   readonly: false,
//   timeout: 5000,
//   // verbose: console.log,
// });

// const getMovieById = db.prepare<number>(`
//   SELECT title FROM movies WHERE id = ?;
// `);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const files = fs.readdirSync(path.join(process.cwd(), 'database'));
  const dbPath = path.join(process.cwd(), 'database/db.sqlite');

  const db = new Database(dbPath, {
    readonly: false,
    timeout: 5000,
    verbose: console.log,
  });

  const getMovieById = db.prepare<number>(`
    SELECT title FROM movies WHERE id = ?;
  `);
  const response = getMovieById.get(1);
  res.status(200).json({ files, response });
};

export default handler;
