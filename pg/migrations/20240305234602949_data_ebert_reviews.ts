import { type Kysely } from 'kysely';
import data from '../json/ebert_reviews.json';
import { tables } from './20240305234522486_tables';

const table = tables.enum.ebert_reviews;

export async function up(db: Kysely<any>): Promise<void> {
  await db.insertInto(table).values(data).execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.deleteFrom(table).execute();
}
