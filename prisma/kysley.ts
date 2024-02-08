import Database from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import { type DB } from './generated/types';

const dialect = new SqliteDialect({
  database: new Database('./prisma/db.sqlite', {
    readonly: false,
    timeout: 5000,
  }),
});

export const kyselyDb = new Kysely<DB>({
  dialect,
});
