import { type Kysely } from 'kysely';
import { chunk } from 'remeda';
import data from '../json/crew.json';
import { tables } from './20240305234522486_tables';

const table = tables.enum.crew;

export async function up(db: Kysely<any>): Promise<void> {
  await Promise.all(
    chunk(data as any[], 5000).map(crew => db.insertInto(table).values(crew).execute())
  );
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.deleteFrom(table).execute();
}
