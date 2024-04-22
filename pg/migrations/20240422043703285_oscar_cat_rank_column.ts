import { type Kysely } from 'kysely';
import { tables } from './20240412045314456_lang_and_country_on_movies_tables';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable(tables.enum.oscars_categories)
    .addColumn('rank', 'integer', col => col.defaultTo(0).notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable(tables.enum.oscars_categories).dropColumn('rank').execute();
}
