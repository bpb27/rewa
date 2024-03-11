import { type Kysely } from 'kysely';
import { tables } from './20240305234522486_tables';

const actorIdIdx = 'idx_actors_on_movies_actor_id';
const movieIdIdx = 'idx_actors_on_movies_movie_id';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createIndex(actorIdIdx)
    .on(tables.enum.actors_on_movies)
    .column('actor_id')
    .execute();
  await db.schema
    .createIndex(movieIdIdx)
    .on(tables.enum.actors_on_movies)
    .column('movie_id')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex(actorIdIdx).execute();
  await db.schema.dropIndex(movieIdIdx).execute();
}
