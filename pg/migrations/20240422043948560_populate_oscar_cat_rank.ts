import { type Kysely } from 'kysely';
import { DB } from '../generated';
import data from '../json/oscar_category_ranks.json';
import { tables } from './20240412045314456_lang_and_country_on_movies_tables';

export async function up(db: Kysely<DB>): Promise<void> {
  const mapped = data.map((cat, i) => ({
    ...cat,
    rank: i + 1,
    relevance: 'low', // unused
  }));

  await db
    .insertInto(tables.enum.oscars_categories)
    .values(mapped)
    .onConflict(oc =>
      oc.column('id').doUpdateSet(eb => ({
        rank: eb.ref('excluded.rank'),
      }))
    )
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.updateTable(tables.enum.oscars_categories).set({ rank: 0 }).execute();
}
