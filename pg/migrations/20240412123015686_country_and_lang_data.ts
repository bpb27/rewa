import { type Kysely } from 'kysely';
import data from '../json/countries_and_languages.json';
import { tables } from './20240412045314456_lang_and_country_on_movies_tables';

export async function up(db: Kysely<any>): Promise<void> {
  await db
    .insertInto(tables.enum.countries)
    .values(data.countries.map(l => ({ name: l.english_name, short: l.iso_3166_1 })))
    .onConflict(c => c.doNothing())
    .execute();

  await db
    .insertInto(tables.enum.languages)
    .values(data.languages.map(l => ({ name: l.english_name, short: l.iso_639_1 })))
    .onConflict(c => c.doNothing())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.deleteFrom(tables.enum.countries).execute();
  await db.deleteFrom(tables.enum.languages).execute();
}
