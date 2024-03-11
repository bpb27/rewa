import { type Kysely } from 'kysely';
import { chunk } from 'remeda';
import data from '../json/actors_on_movies.json';
import { tables } from './20240305234522486_tables';

const table = tables.enum.actors_on_movies;

export async function up(db: Kysely<any>): Promise<void> {
  await Promise.all(
    chunk(data as any[], 5000).map(group =>
      db
        .insertInto(table)
        .onConflict(con => con.doNothing())
        .values(group)
        .execute()
    )
  );
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.deleteFrom(table).execute();
}
