import { type Kysely } from 'kysely';
import { chunk } from 'remeda';
import { DB } from '../generated';
import data from '../json/actors-popularity.json';
import { tables } from './20240412045314456_lang_and_country_on_movies_tables';

export async function up(db: Kysely<DB>): Promise<void> {
  const allActors = await db.selectFrom(tables.enum.actors).selectAll().execute();
  const values = Object.entries(data)
    .map(([tmdb_id, popularity]) => ({
      ...allActors.find(a => a.tmdb_id === Number(tmdb_id))!,
      popularity,
    }))
    .filter(a => a.id);

  await Promise.all(
    chunk(values, 10000).map(actorChunk =>
      db
        .insertInto(tables.enum.actors)
        .values(actorChunk)
        .onConflict(oc =>
          oc.column('tmdb_id').doUpdateSet(eb => ({
            popularity: eb.ref('excluded.popularity'),
          }))
        )
        .execute()
    )
  );
}

export async function down(_db: Kysely<DB>): Promise<void> {}
