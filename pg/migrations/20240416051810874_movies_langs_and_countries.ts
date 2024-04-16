import { type Kysely } from 'kysely';
import { chunk } from 'remeda';
import { DB } from '../generated';
import data from '../json/movies-lang-and-coun.json';
import { tables } from './20240412045314456_lang_and_country_on_movies_tables';

export async function up(db: Kysely<DB>): Promise<void> {
  const languages = await db.selectFrom(tables.enum.languages).selectAll().execute();
  const countries = await db.selectFrom(tables.enum.countries).selectAll().execute();
  const allMovies = await db.selectFrom(tables.enum.movies).selectAll().execute();

  await Promise.all(
    chunk(data.countries, 2500).map(movies =>
      db
        .insertInto(tables.enum.production_countries_on_movies)
        .values(
          movies.map(movie => ({
            movie_id: allMovies.find(m => m.tmdb_id === movie.tmdb_id)!.id,
            country_id: countries.find(c => c.short === movie.country)!.id,
          }))
        )
        .execute()
    )
  );

  await Promise.all(
    chunk(data.languages, 2500).map(movies =>
      db
        .insertInto(tables.enum.spoken_languages_on_movies)
        .values(
          movies.map(movie => ({
            movie_id: allMovies.find(m => m.tmdb_id === movie.tmdb_id)!.id,
            language_id: languages.find(c => c.short === movie.language)!.id,
          }))
        )
        .execute()
    )
  );
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.deleteFrom('production_countries_on_movies').execute();
  await db.deleteFrom('spoken_languages_on_movies').execute();
}
