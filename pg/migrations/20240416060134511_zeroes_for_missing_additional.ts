import { type Kysely } from 'kysely';
import { DB } from '../generated';
import { tables } from './20240412045314456_lang_and_country_on_movies_tables';

export async function up(db: Kysely<DB>): Promise<void> {
  const english = await db
    .selectFrom('languages')
    .selectAll()
    .where('languages.name', '=', 'English')
    .executeTakeFirstOrThrow();

  await db
    .updateTable(tables.enum.movies)
    .set({ popularity: 0 })
    .where('popularity', 'is', null)
    .execute();

  await db
    .updateTable(tables.enum.movies)
    .set({ vote_average: 0 })
    .where('vote_average', 'is', null)
    .execute();

  await db
    .updateTable(tables.enum.movies)
    .set({ vote_count: 0 })
    .where('vote_count', 'is', null)
    .execute();

  await db
    .updateTable(tables.enum.movies)
    .set({ language_id: english.id })
    .where('language_id', 'is', null)
    .execute();

  await db
    .updateTable(tables.enum.actors)
    .set({ popularity: 0 })
    .where('popularity', 'is', null)
    .execute();

  await db
    .updateTable(tables.enum.crew)
    .set({ popularity: 0 })
    .where('popularity', 'is', null)
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // await db.deleteFrom('something').execute();
}
