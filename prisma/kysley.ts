// import Database from 'better-sqlite3';
import { PostgresDialect } from 'kysely';
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
    connectionString: process.env.DATABASE_URL,
    max: 10,
  }),
});

export type KyselyDB = DB;
