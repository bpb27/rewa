// import Database from 'better-sqlite3';
import { Kysely, ParseJSONResultsPlugin, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { type DB } from './generated/types';

// const sqliteDialect = new SqliteDialect({
//   database: new Database('./prisma/db.sqlite', {
//     readonly: false,
//     timeout: 5000,
//   }),
// });

// export const kyselyDbSqlite = new Kysely<DB>({
//   dialect: sqliteDialect,
//   // log: ['query'],
//   plugins: [new ParseJSONResultsPlugin()],
// });

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: 'postgresql://localhost:5432/rewa',
    max: 10,
  }),
});

export type KyselyDB = DB;

export const kyselyDb = new Kysely<DB>({
  dialect,
  log: ['query'],
  plugins: [new ParseJSONResultsPlugin()],
});
