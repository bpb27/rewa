import { type Kysely } from 'kysely';
import { chunk } from 'remeda';
import data from '../json/keywords_on_movies.json';
import { tables } from './20240305234522486_tables';

const table = tables.enum.keywords_on_movies;

export async function up(db: Kysely<any>): Promise<void> {
  await Promise.all(chunk(data, 5000).map(group => db.insertInto(table).values(group).execute()));
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.deleteFrom(table).execute();
}
