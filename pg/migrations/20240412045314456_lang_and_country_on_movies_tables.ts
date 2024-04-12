import { type Kysely } from 'kysely';
import { z } from 'zod';
import { tables as priorTable } from './20240412043903212_language_and_countries_tables';

export const tables = z.enum([
  ...priorTable.options,
  'production_countries_on_movies',
  'spoken_languages_on_movies',
]);

const fk = (table: z.infer<typeof tables>) => `${table}.id`;

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(tables.enum.production_countries_on_movies)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('movie_id', 'integer', col =>
      col.notNull().references(fk('movies')).onDelete('cascade')
    )
    .addColumn('country_id', 'integer', col =>
      col.notNull().references(fk('countries')).onDelete('cascade')
    )
    .addUniqueConstraint('movie_id_country_id_unique', ['movie_id', 'country_id'])
    .execute();

  await db.schema
    .createTable(tables.enum.spoken_languages_on_movies)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('movie_id', 'integer', col =>
      col.notNull().references(fk('movies')).onDelete('cascade')
    )
    .addColumn('language_id', 'integer', col =>
      col.notNull().references(fk('languages')).onDelete('cascade')
    )
    .addUniqueConstraint('movie_id_language_id_unique', ['movie_id', 'language_id'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.deleteFrom(tables.enum.countries).execute();
  await db.deleteFrom(tables.enum.languages).execute();
}
