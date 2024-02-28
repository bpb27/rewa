import { LibsqlDialect } from '@libsql/kysely-libsql';
import { Kysely } from 'kysely';
import { ParseJSONResultsPlugin } from '../src/utils/kysely-json-plugin';
import { type DB } from './generated/types';

// const local = new SqliteDialect({
//   database: new Database('./prisma/db.sqlite', {
//     readonly: false,
//     timeout: 5000,
//   }),
// });

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
