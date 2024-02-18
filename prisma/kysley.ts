import { LibsqlDialect } from '@libsql/kysely-libsql';
import Database from 'better-sqlite3';
import { Kysely, ParseJSONResultsPlugin, SqliteDialect } from 'kysely';
import { type DB } from './generated/types';

// NB: node_modules/kysely/dist/esm/plugin/parse-json-results/parse-json-results-plugin.js
/*
  function parseObject(obj) {
    const newObj = {};
    for (const key in obj) {
        newObj[key] = parse(obj[key]);
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
  url: 'libsql://rewa-test-2ky-bpb27.turso.io',
  authToken:
    'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDgxODc3ODAsImlkIjoiODYwMzRhNGItY2RiMi0xMWVlLThmMWItNmU5NzQxNjJlYjhkIn0.AvxQBDiceeXJCGkFvnU9WinHjNa4d5s5vg7K5XdlFzs_r0Zx2O-6VGsis2OJnuodUYgU76piT9mH_9PvKe4xCw',
});

export type KyselyDB = DB;

export const kyselyDb = new Kysely<DB>({
  dialect: local,
  log: ['query'],
  plugins: [new ParseJSONResultsPlugin()],
});
