import { Kysely, ParseJSONResultsPlugin, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { type DB } from './generated';

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  }),
});

export const kyselyDb = new Kysely<DB>({
  dialect,
  log: ['query'],
  plugins: [new ParseJSONResultsPlugin()],
});
