import { LibsqlDialect } from '@libsql/kysely-libsql';
import Database from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import { ParseJSONResultsPlugin } from '../src/utils/kysely-json-plugin';
import { type DB } from './generated/types';

// NB: node_modules/kysely/dist/esm/plugin/parse-json-results/parse-json-results-plugin.js
/*
  function parseObject(obj) {
    const newObj = {};
    for (const key in obj) {
    }
    return newObj;
}
*/

/*
  surprisingly slow against turso
  confirmed indexes are all present
*/

const local = new SqliteDialect({
  database: new Database('./prisma/db.sqlite', {
    readonly: false,
    timeout: 5000,
  }),
});

const remote = new LibsqlDialect({
  url: 'libsql://rewa-test-3-bpb27.turso.io',
  authToken: process.env.TURSO_TOKEN,
});

export type KyselyDB = DB;

export const kyselyDb = new Kysely<DB>({
  dialect: remote,
  log: ['query'],
  plugins: [new ParseJSONResultsPlugin()],
});
