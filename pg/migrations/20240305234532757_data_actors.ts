import { type Kysely } from 'kysely';
import { chunk } from 'remeda';
import data from '../json/actors.json';
import { tables } from './20240305234522486_tables';

const table = tables.enum.actors;

export async function up(db: Kysely<any>): Promise<void> {
  await Promise.all(
    chunk(data as any[], 5000).map(actors => db.insertInto(table).values(actors).execute())
  );
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.deleteFrom(table).execute();
}
