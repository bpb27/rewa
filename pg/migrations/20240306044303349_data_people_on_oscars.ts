import { type Kysely } from 'kysely';
import data from '../json/people_on_oscars.json';
import { tables } from './20240305234522486_tables';

const actorsTable = tables.enum.actors_on_oscars;
const crewTable = tables.enum.crew_on_oscars;

export async function up(db: Kysely<any>): Promise<void> {
  await db.insertInto(actorsTable).values(data.actors_on_oscars).execute();
  await db.insertInto(crewTable).values(data.crew_on_oscars).execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.deleteFrom(actorsTable).execute();
  await db.deleteFrom(crewTable).execute();
}
