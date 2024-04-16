import { type Kysely } from 'kysely';
import { chunk } from 'remeda';
import { DB } from '../generated';
import data from '../json/movies-additional.json';
import { tables } from './20240412045314456_lang_and_country_on_movies_tables';

export async function up(db: Kysely<any>): Promise<void> {
  const languages = await db.selectFrom(tables.enum.languages).selectAll().execute();
  const allMovies = await db.selectFrom(tables.enum.movies).selectAll().execute();

  await Promise.all(
    chunk(data, 2500).map(movies =>
      db
        .insertInto(tables.enum.movies)
        .values(
          movies.map(movie => ({
            ...allMovies.find(m => m.tmdb_id === movie.tmdb_id)!,
            tmdb_id: movie.tmdb_id,
            popularity: movie.popularity,
            vote_average: movie.vote_average,
            vote_count: movie.vote_count,
            language_id: languages.find(l => l.short === movie.language)?.id,
          }))
        )
        .onConflict(oc =>
          oc.column('tmdb_id').doUpdateSet(eb => ({
            language_id: eb.ref('excluded.language_id'),
            popularity: eb.ref('excluded.popularity'),
            vote_average: eb.ref('excluded.vote_average'),
            vote_count: eb.ref('excluded.vote_count'),
          }))
        )
        .execute()
    )
  );
}

export async function down(_db: Kysely<DB>): Promise<void> {}
