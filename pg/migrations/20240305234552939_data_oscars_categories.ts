import { type Kysely } from 'kysely';
import data from '../json/oscar_awards.json';
import { tables } from './20240305234522486_tables';

const categoriesTable = tables.enum.oscars_categories;
const awardsTable = tables.enum.oscars_awards;

export async function up(db: Kysely<any>): Promise<void> {
  await db.insertInto(categoriesTable).values(data.categories).execute();
  await db.insertInto(awardsTable).values(data.awards).execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.deleteFrom(categoriesTable).execute();
  await db.deleteFrom(awardsTable).execute();
}
