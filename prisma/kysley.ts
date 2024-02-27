import Database from 'better-sqlite3';
import fs from 'fs';
import { Kysely, ParseJSONResultsPlugin, SqliteDialect } from 'kysely';
import path from 'path';
import { type DB } from './generated/types';

// needed so vercel includes sqlite file in the lambas
const files = fs.readdirSync(path.join(process.cwd(), 'prisma'));
files.forEach(f => console.log(f));

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
