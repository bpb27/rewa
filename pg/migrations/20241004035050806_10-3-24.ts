
import { type Kysely } from 'kysely';
import { updateStreamers } from '../../scripts/update-streamers-for-migration';
import { DB } from '../generated';
import data from '../json/rewa-streamers-2024-10-04.json';

export async function up(db: Kysely<DB>): Promise<void> {
  await updateStreamers(data, db);
}

export async function down(db: Kysely<any>): Promise<void> {
  // await db.deleteFrom('something').execute();
}
