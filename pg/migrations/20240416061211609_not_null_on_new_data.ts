import { type Kysely } from 'kysely';
import { DB } from '../generated';
import { tables } from './20240412045314456_lang_and_country_on_movies_tables';

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .alterTable(tables.enum.movies)
    .alterColumn('popularity', alt => alt.setNotNull())
    .alterColumn('vote_average', alt => alt.setNotNull())
    .alterColumn('vote_count', alt => alt.setNotNull())
    .alterColumn('language_id', alt => alt.setNotNull())
    .execute();

  await db.schema
    .alterTable(tables.enum.actors)
    .alterColumn('popularity', alt => alt.setNotNull())
    .execute();

  await db.schema
    .alterTable(tables.enum.crew)
    .alterColumn('popularity', alt => alt.setNotNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable(tables.enum.movies)
    .alterColumn('popularity', alt => alt.dropNotNull())
    .alterColumn('vote_average', alt => alt.dropNotNull())
    .alterColumn('vote_count', alt => alt.dropNotNull())
    .alterColumn('language_id', alt => alt.dropNotNull())
    .execute();

  await db.schema
    .alterTable(tables.enum.actors)
    .alterColumn('popularity', alt => alt.dropNotNull())
    .execute();

  await db.schema
    .alterTable(tables.enum.crew)
    .alterColumn('popularity', alt => alt.dropNotNull())
    .execute();
}
