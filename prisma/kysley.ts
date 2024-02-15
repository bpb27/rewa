import Database from 'better-sqlite3';
import { Kysely, ParseJSONResultsPlugin, SqliteDialect } from 'kysely';
import { type DB } from './generated/types';

const dialect = new SqliteDialect({
  database: new Database('./prisma/db.sqlite', {
    readonly: false,
    timeout: 5000,
  }),
});

export type KyselyDB = DB;

export const kyselyDb = new Kysely<DB>({
  dialect,
  log: ['query'],
  plugins: [new ParseJSONResultsPlugin()],
});
