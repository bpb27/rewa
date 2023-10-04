import DB, { type Database } from 'better-sqlite3';
import { writeFileSync } from 'fs';
import { z } from 'zod';

export const connectToDb = () =>
  new DB('./prisma/db.sqlite', {
    readonly: false,
    timeout: 5000,
  });

const tableNameSchema = z.enum([
  'actors',
  'actors_on_movies',
  'crew',
  'crew_on_movies',
  'episodes',
  'genres',
  'genres_on_movies',
  'hosts',
  'hosts_on_episodes',
  'movies',
  'oscars_awards',
  'oscars_categories',
  'oscars_nominations',
  'production_companies',
  'production_companies_on_movies',
  'streamers',
  'streamers_on_movies',
]);

export const TABLES = tableNameSchema.Enum;

export type TableName = z.infer<typeof tableNameSchema>;

export const dropTable = (db: Database, tableName: TableName) =>
  db.exec(`DROP TABLE IF EXISTS ${tableName}`);

export const writeToFile = (data: any, path: string) => {
  writeFileSync(path, JSON.stringify(data));
};
