import { type Kysely } from 'kysely';
import data from '../json/keywords.json';
import { tables } from './20240305234522486_tables';

const genresTable = tables.enum.genres;
const keywordsTable = tables.enum.keywords;

export async function up(db: Kysely<any>): Promise<void> {
  await db.insertInto(genresTable).values(data.genres).execute();
  await db.insertInto(keywordsTable).values(data.keywords).execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.deleteFrom(genresTable).execute();
  await db.deleteFrom(keywordsTable).execute();
}
