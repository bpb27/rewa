import { type Kysely } from 'kysely';
import { chunk } from 'remeda';
import { DB } from '../generated';
import data from '../json/crew-popularity.json';
import { tables } from './20240412045314456_lang_and_country_on_movies_tables';

export async function up(db: Kysely<DB>): Promise<void> {
  const allCrew = await db.selectFrom(tables.enum.crew).selectAll().execute();
  const values = Object.entries(data)
    .map(([tmdb_id, popularity]) => ({
      ...allCrew.find(a => a.tmdb_id === Number(tmdb_id))!,
      popularity,
    }))
    .filter(a => a.id);

  await Promise.all(
    chunk(values, 10000).map(crewChunk =>
      db
        .insertInto(tables.enum.crew)
        .values(crewChunk)
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
