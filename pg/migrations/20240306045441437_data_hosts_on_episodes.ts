import { type Kysely } from 'kysely';
import { chunk } from 'remeda';
import data from '../json/hosts_on_episodes.json';
import { tables } from './20240305234522486_tables';

const table = tables.enum.hosts_on_episodes;

export async function up(db: Kysely<any>): Promise<void> {
  await Promise.all(chunk(data, 5000).map(noms => db.insertInto(table).values(noms).execute()));
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.deleteFrom(table).execute();
}
