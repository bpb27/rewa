import fs from 'fs';
import { isString } from 'remeda';

const name = process.argv[2];
if (!isString(name)) {
  console.error('Provide a name, por ejemplo:');
  console.log('npm run migration:generate changing_shit_up');
  process.exit(1);
}

const contents = `
import { type Kysely } from 'kysely';
import data from '../json/movies.json';
import { tables } from './20240305234522486_tables';

export async function up(db: Kysely<any>): Promise<void> {
  await db.insertInto(tables.enum.movies).values(data).execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.deleteFrom(tables.enum.movies).execute();
}
`;

const timestamp = new Date().toISOString().replace(/[\D]/g, '');
fs.writeFileSync(`./pg/migrations/${timestamp}_${name}.ts`, contents);
