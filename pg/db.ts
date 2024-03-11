import { createKysely } from '@vercel/postgres-kysely';
import { Kysely, ParseJSONResultsPlugin, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { type DB } from './generated';

const pgConfig = {
  connectionString: process.env.DATABASE_URL,
  max: 10,
};

const plugins = [new ParseJSONResultsPlugin()];

export const kyselyDb =
  process.env.NODE_ENV === 'development'
    ? new Kysely<DB>({
        dialect: new PostgresDialect({ pool: new Pool(pgConfig) }),
        log: ['query'],
        plugins,
      })
    : createKysely<DB>(pgConfig, { plugins });
