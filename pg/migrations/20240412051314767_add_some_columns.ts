import { type Kysely } from 'kysely';
import { z } from 'zod';
import { tables } from './20240412045314456_lang_and_country_on_movies_tables';

const fk = (table: z.infer<typeof tables>) => `${table}.id`;

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable(tables.enum.movies)
    .addColumn('popularity', 'float4')
    .addColumn('vote_average', 'float4')
    .addColumn('vote_count', 'integer')
    .addColumn('language_id', 'integer', col => col.references(fk('languages')))
    .execute();

  await db.schema.alterTable(tables.enum.actors).addColumn('popularity', 'float4').execute();

  await db.schema.alterTable(tables.enum.crew).addColumn('popularity', 'float4').execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable(tables.enum.movies)
    .dropColumn('popularity')
    .dropColumn('vote_average')
    .dropColumn('vote_count')
    .dropColumn('language_id')
    .execute();

  await db.schema.alterTable(tables.enum.actors).dropColumn('popularity').execute();

  await db.schema.alterTable(tables.enum.crew).dropColumn('popularity').execute();
}
