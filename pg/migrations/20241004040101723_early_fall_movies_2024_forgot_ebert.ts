import { type Kysely } from 'kysely';
import { DB } from '../generated';
import { tables } from './20240412045314456_lang_and_country_on_movies_tables';

export async function up(db: Kysely<DB>): Promise<void> {
  const sixthSense = await db
    .selectFrom(tables.enum.movies)
    .select('id')
    .where('tmdb_id', '=', 745)
    .execute();

  const blairWitch = await db
    .selectFrom(tables.enum.movies)
    .select('id')
    .where('tmdb_id', '=', 2667)
    .execute();

  await db
    .insertInto(tables.enum.ebert_reviews)
    .values({ movie_id: sixthSense[0].id, path: '/reviews/the-sixth-sense-1999', rating: 3 })
    .execute();

  await db
    .insertInto(tables.enum.ebert_reviews)
    .values({
      movie_id: blairWitch[0].id,
      path: '/reviews/the-blair-witch-project-1999',
      rating: 4,
    })
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // await db.deleteFrom('something').execute();
}
