import { type Kysely } from 'kysely';
import data from '../json/companies.json';
import { tables } from './20240305234522486_tables';

const productionTable = tables.enum.production_companies;
const streamersTable = tables.enum.streamers;

export async function up(db: Kysely<any>): Promise<void> {
  await db.insertInto(productionTable).values(data.production_companies).execute();
  await db.insertInto(streamersTable).values(data.streamers).execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.deleteFrom(productionTable).execute();
  await db.deleteFrom(streamersTable).execute();
}
