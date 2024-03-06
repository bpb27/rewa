import { type Kysely } from 'kysely';
import { z } from 'zod';

export const tables = z.enum([
  'actors_on_movies',
  'actors_on_oscars',
  'actors',
  'crew_jobs',
  'crew_on_movies',
  'crew_on_oscars',
  'crew',
  'ebert_reviews',
  'episodes',
  'genres_on_movies',
  'genres',
  'hosts_on_episodes',
  'hosts',
  'keywords_on_movies',
  'keywords',
  'movies',
  'oscars_awards',
  'oscars_categories',
  'oscars_nominations',
  'production_companies_on_movies',
  'production_companies',
  'streamers_on_movies',
  'streamers',
]);

const fk = (table: z.infer<typeof tables>) => `${table}.id`;

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(tables.enum.movies)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('budget', 'bigint', col => col.notNull())
    .addColumn('imdb_id', 'text', col => col.notNull().unique())
    .addColumn('overview', 'text', col => col.notNull())
    .addColumn('poster_path', 'text', col => col.notNull())
    .addColumn('release_date', 'date', col => col.notNull())
    .addColumn('revenue', 'bigint', col => col.notNull())
    .addColumn('runtime', 'integer', col => col.notNull())
    .addColumn('tagline', 'text', col => col.notNull())
    .addColumn('title', 'text', col => col.notNull())
    .addColumn('tmdb_id', 'integer', col => col.notNull().unique())
    .execute();

  await db.schema
    .createTable(tables.enum.actors)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('gender', 'integer', col => col.notNull())
    .addColumn('name', 'text', col => col.notNull())
    .addColumn('profile_path', 'text')
    .addColumn('tmdb_id', 'integer', col => col.notNull().unique())
    .execute();

  await db.schema
    .createTable(tables.enum.actors_on_movies)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('movie_id', 'integer', col =>
      col.notNull().references(fk('movies')).onDelete('cascade')
    )
    .addColumn('actor_id', 'integer', col =>
      col.notNull().references(fk('actors')).onDelete('cascade')
    )
    .addColumn('character', 'text', col => col.notNull())
    .addColumn('credit_id', 'text', col => col.notNull().unique())
    .addColumn('credit_order', 'integer', col => col.notNull())
    .addUniqueConstraint('movie_id_actor_id_unique', ['movie_id', 'actor_id'])
    .execute();

  await db.schema
    .createTable(tables.enum.crew_jobs)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('job', 'text', col => col.notNull())
    .addColumn('department', 'text', col => col.notNull())
    .addUniqueConstraint('job_department_unique', ['job', 'department'])
    .execute();

  await db.schema
    .createTable(tables.enum.crew)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('gender', 'integer', col => col.notNull())
    .addColumn('tmdb_id', 'integer', col => col.notNull().unique())
    .addColumn('name', 'text', col => col.notNull())
    .addColumn('profile_path', 'text')
    .execute();

  await db.schema
    .createTable(tables.enum.crew_on_movies)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('movie_id', 'integer', col =>
      col.notNull().references(fk('movies')).onDelete('cascade')
    )
    .addColumn('crew_id', 'integer', col =>
      col.notNull().references(fk('crew')).onDelete('cascade')
    )
    .addColumn('job_id', 'integer', col =>
      col.notNull().references(fk('crew_jobs')).onDelete('cascade')
    )
    .addColumn('credit_id', 'text', col => col.notNull().unique())
    .addUniqueConstraint('movie_id_crew_id_job_id_unique', ['movie_id', 'crew_id', 'job_id'])
    .execute();

  await db.schema
    .createTable(tables.enum.genres)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('name', 'text', col => col.notNull().unique())
    .execute();

  await db.schema
    .createTable(tables.enum.genres_on_movies)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('movie_id', 'integer', col =>
      col.notNull().references(fk('movies')).onDelete('cascade')
    )
    .addColumn('genre_id', 'integer', col =>
      col.notNull().references(fk('genres')).onDelete('cascade')
    )
    .addUniqueConstraint('movie_id_genre_id_unique', ['movie_id', 'genre_id'])
    .execute();

  await db.schema
    .createTable(tables.enum.production_companies)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('tmdb_id', 'integer', col => col.notNull().unique())
    .addColumn('name', 'text', col => col.notNull())
    .addColumn('logo_path', 'text')
    .execute();

  await db.schema
    .createTable(tables.enum.production_companies_on_movies)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('movie_id', 'integer', col =>
      col.notNull().references(fk('movies')).onDelete('cascade')
    )
    .addColumn('production_company_id', 'integer', col =>
      col.notNull().references(fk('production_companies')).onDelete('cascade')
    )
    .addUniqueConstraint('movie_id_production_company_id_unique', [
      'movie_id',
      'production_company_id',
    ])
    .execute();

  await db.schema
    .createTable(tables.enum.streamers)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('name', 'text', col => col.notNull())
    .addColumn('tmdb_id', 'integer', col => col.notNull().unique())
    .addColumn('logo_path', 'text')
    .execute();

  await db.schema
    .createTable(tables.enum.streamers_on_movies)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('movie_id', 'integer', col =>
      col.notNull().references(fk('movies')).onDelete('cascade')
    )
    .addColumn('streamer_id', 'integer', col =>
      col.notNull().references(fk('streamers')).onDelete('cascade')
    )
    .addUniqueConstraint('movie_id_streamer_id_unique', ['movie_id', 'streamer_id'])
    .execute();

  await db.schema
    .createTable(tables.enum.keywords)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('name', 'text', col => col.notNull().unique())
    .execute();

  await db.schema
    .createTable(tables.enum.keywords_on_movies)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('movie_id', 'integer', col =>
      col.notNull().references(fk('movies')).onDelete('cascade')
    )
    .addColumn('keyword_id', 'integer', col =>
      col.notNull().references(fk('keywords')).onDelete('cascade')
    )
    .addUniqueConstraint('movie_id_keyword_id_unique', ['movie_id', 'keyword_id'])
    .execute();

  await db.schema
    .createTable(tables.enum.episodes)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('title', 'text', col => col.notNull())
    .addColumn('episode_order', 'integer', col => col.notNull())
    .addColumn('date', 'text', col => col.notNull())
    .addColumn('spotify_url', 'text', col => col.notNull().unique())
    .addColumn('movie_id', 'integer', col =>
      col.notNull().references(fk('movies')).onDelete('cascade')
    )
    .execute();

  await db.schema
    .createTable(tables.enum.hosts)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('name', 'text', col => col.notNull().unique())
    .execute();

  await db.schema
    .createTable(tables.enum.hosts_on_episodes)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('host_id', 'integer', col =>
      col.notNull().references(fk('hosts')).onDelete('cascade')
    )
    .addColumn('episode_id', 'integer', col =>
      col.notNull().references(fk('episodes')).onDelete('cascade')
    )
    .addUniqueConstraint('host_id_episode_id_unique', ['host_id', 'episode_id'])
    .execute();

  await db.schema
    .createTable(tables.enum.ebert_reviews)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('movie_id', 'integer', col =>
      col.notNull().references(fk('movies')).onDelete('cascade')
    )
    .addColumn('rating', 'real', col => col.notNull())
    .addColumn('path', 'text')
    .addUniqueConstraint('movie_id_unique', ['movie_id'])
    .execute();

  await db.schema
    .createTable(tables.enum.oscars_categories)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('name', 'text', col => col.notNull())
    .addColumn('relevance', 'text', col => col.notNull())
    .execute();

  await db.schema
    .createTable(tables.enum.oscars_awards)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('name', 'text', col => col.notNull())
    .addColumn('category_id', 'integer', col =>
      col.notNull().references(fk('oscars_categories')).onDelete('cascade')
    )
    .execute();

  await db.schema
    .createTable(tables.enum.oscars_nominations)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('film_year', 'integer', col => col.notNull())
    .addColumn('ceremony_year', 'integer', col => col.notNull())
    .addColumn('won', 'boolean', col => col.notNull())
    .addColumn('recipient', 'text', col => col.notNull())
    .addColumn('movie_id', 'integer', col =>
      col.notNull().references(fk('movies')).onDelete('cascade')
    )
    .addColumn('award_id', 'integer', col =>
      col.notNull().references(fk('oscars_awards')).onDelete('cascade')
    )
    .addUniqueConstraint('movie_id_award_id_recipient_unique', [
      'movie_id',
      'award_id',
      'recipient',
    ])
    .execute();

  await db.schema
    .createTable(tables.enum.actors_on_oscars)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('oscar_id', 'integer', col =>
      col.notNull().references(fk('oscars_nominations')).onDelete('cascade')
    )
    .addColumn('actor_id', 'integer', col =>
      col.notNull().references(fk('actors')).onDelete('cascade')
    )
    .addUniqueConstraint('oscar_id_actor_id_unique', ['oscar_id', 'actor_id'])
    .execute();

  await db.schema
    .createTable(tables.enum.crew_on_oscars)
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('oscar_id', 'integer', col =>
      col.notNull().references(fk('oscars_nominations')).onDelete('cascade')
    )
    .addColumn('crew_id', 'integer', col =>
      col.notNull().references(fk('crew')).onDelete('cascade')
    )
    .addUniqueConstraint('oscar_id_crew_id_unique', ['oscar_id', 'crew_id'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  for (let table in tables.Values) {
    await db.schema.dropTable(table).cascade().ifExists().execute();
  }
}
