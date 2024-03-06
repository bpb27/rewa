import { type Kysely } from 'kysely';
import data from '../json/episodes.json';
import { tables } from './20240305234522486_tables';

const episodesTable = tables.enum.episodes;
const hostsTable = tables.enum.hosts;

export async function up(db: Kysely<any>): Promise<void> {
  await db.insertInto(episodesTable).values(data.episodes).execute();
  await db.insertInto(hostsTable).values(data.hosts).execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.deleteFrom(episodesTable).execute();
  await db.deleteFrom(hostsTable).execute();
}
