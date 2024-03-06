import Database from 'better-sqlite3';
import { Kysely, ParseJSONResultsPlugin, SqliteDialect } from 'kysely';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getMovies } from '~/apik/get-movies';
import { defaultQps } from '~/data/query-params';
import { DB } from '../../../prisma/generated/types';

const sqliteDialect = new SqliteDialect({
  database: new Database('./prisma/db.sqlite', {
    readonly: false,
    timeout: 5000,
  }),
});

export const kyselyDbSqlite = new Kysely<DB>({
  dialect: sqliteDialect,
  plugins: [new ParseJSONResultsPlugin()],
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await getMovies(defaultQps);
  res.status(200).json(response);
}
