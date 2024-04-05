import { createKysely } from '@vercel/postgres-kysely';
import { Kysely, ParseJSONResultsPlugin, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { type DB } from './generated';

// @vercel/postgres-kysely doesn't work w/ local so need to use different clients :/

const plugins = [new ParseJSONResultsPlugin()];

export const localDb = (connectionString?: string) =>
  new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: connectionString || process.env.DATABASE_URL,
        max: 10,
      }),
    }),
    log: ['query'],
    plugins,
  });

export const remoteDb = (connectionString?: string) =>
  createKysely<DB>(
    {
      connectionString: connectionString || process.env.DATABASE_URL,
      max: 10,
    },
    { plugins, log: [] }
  );

export const kyselyDb = process.env.NODE_ENV === 'development' ? localDb() : remoteDb();
