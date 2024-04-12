import { type Kysely } from 'kysely';
import { z } from 'zod';
import { tables as priorTable } from './20240305234522486_tables';

export const tables = z.enum([...priorTable.options, 'languages', 'countries']);

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(tables.enum.countries)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('name', 'text', col => col.notNull().unique())
    .addColumn('short', 'text', col => col.notNull().unique())
    .execute();

  await db.schema
    .createTable(tables.enum.languages)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('name', 'text', col => col.notNull().unique())
    .addColumn('short', 'text', col => col.notNull().unique())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.deleteFrom(tables.enum.countries).execute();
  await db.deleteFrom(tables.enum.languages).execute();
}
