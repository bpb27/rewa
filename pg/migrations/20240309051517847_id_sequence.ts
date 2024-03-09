import { sql, type Kysely } from 'kysely';

// NB: manually inserted ids in prior migrations
// so need to update the id sequence for all tables

export async function up(db: Kysely<any>): Promise<void> {
  await sql`select setval('movies_id_seq', (select max(id) + 1 from movies));`.execute(db);
  await sql`select setval('actors_on_movies_id_seq', (select max(id) + 1 from actors_on_movies));`.execute(db);
  await sql`select setval('actors_on_oscars_id_seq', (select max(id) + 1 from actors_on_oscars));`.execute(db);
  await sql`select setval('actors_id_seq', (select max(id) + 1 from actors));`.execute(db);
  await sql`select setval('crew_jobs_id_seq', (select max(id) + 1 from crew_jobs));`.execute(db);
  await sql`select setval('crew_on_movies_id_seq', (select max(id) + 1 from crew_on_movies));`.execute(db);
  await sql`select setval('crew_on_oscars_id_seq', (select max(id) + 1 from crew_on_oscars));`.execute(db);
  await sql`select setval('crew_id_seq', (select max(id) + 1 from crew));`.execute(db);
  await sql`select setval('ebert_reviews_id_seq', (select max(id) + 1 from ebert_reviews));`.execute(db);
  await sql`select setval('episodes_id_seq', (select max(id) + 1 from episodes));`.execute(db);
  await sql`select setval('genres_on_movies_id_seq', (select max(id) + 1 from genres_on_movies));`.execute(db);
  await sql`select setval('genres_id_seq', (select max(id) + 1 from genres));`.execute(db);
  await sql`select setval('hosts_on_episodes_id_seq', (select max(id) + 1 from hosts_on_episodes));`.execute(db);
  await sql`select setval('hosts_id_seq', (select max(id) + 1 from hosts));`.execute(db);
  await sql`select setval('keywords_on_movies_id_seq', (select max(id) + 1 from keywords_on_movies));`.execute(db);
  await sql`select setval('keywords_id_seq', (select max(id) + 1 from keywords));`.execute(db);
  await sql`select setval('movies_id_seq', (select max(id) + 1 from movies));`.execute(db);
  await sql`select setval('oscars_awards_id_seq', (select max(id) + 1 from oscars_awards));`.execute(db);
  await sql`select setval('oscars_categories_id_seq', (select max(id) + 1 from oscars_categories));`.execute(db);
  await sql`select setval('oscars_nominations_id_seq', (select max(id) + 1 from oscars_nominations));`.execute(db);
  await sql`select setval('production_companies_on_movies_id_seq', (select max(id) + 1 from production_companies_on_movies));`.execute(db);
  await sql`select setval('production_companies_id_seq', (select max(id) + 1 from production_companies));`.execute(db);
  await sql`select setval('streamers_on_movies_id_seq', (select max(id) + 1 from streamers_on_movies));`.execute(db);
  await sql`select setval('streamers_id_seq', (select max(id) + 1 from streamers));`.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`select setval('movies_id_seq', (select min(id) from movies));`.execute(db);
  await sql`select setval('actors_on_movies_id_seq', (select min(id) from actors_on_movies));`.execute(db);
  await sql`select setval('actors_on_oscars_id_seq', (select min(id) from actors_on_oscars));`.execute(db);
  await sql`select setval('actors_id_seq', (select min(id) from actors));`.execute(db);
  await sql`select setval('crew_jobs_id_seq', (select min(id) from crew_jobs));`.execute(db);
  await sql`select setval('crew_on_movies_id_seq', (select min(id) from crew_on_movies));`.execute(db);
  await sql`select setval('crew_on_oscars_id_seq', (select min(id) from crew_on_oscars));`.execute(db);
  await sql`select setval('crew_id_seq', (select min(id) from crew));`.execute(db);
  await sql`select setval('ebert_reviews_id_seq', (select min(id) from ebert_reviews));`.execute(db);
  await sql`select setval('episodes_id_seq', (select min(id) from episodes));`.execute(db);
  await sql`select setval('genres_on_movies_id_seq', (select min(id) from genres_on_movies));`.execute(db);
  await sql`select setval('genres_id_seq', (select min(id) from genres));`.execute(db);
  await sql`select setval('hosts_on_episodes_id_seq', (select min(id) from hosts_on_episodes));`.execute(db);
  await sql`select setval('hosts_id_seq', (select min(id) from hosts));`.execute(db);
  await sql`select setval('keywords_on_movies_id_seq', (select min(id) from keywords_on_movies));`.execute(db);
  await sql`select setval('keywords_id_seq', (select min(id) from keywords));`.execute(db);
  await sql`select setval('movies_id_seq', (select min(id) from movies));`.execute(db);
  await sql`select setval('oscars_awards_id_seq', (select min(id) from oscars_awards));`.execute(db);
  await sql`select setval('oscars_categories_id_seq', (select min(id) from oscars_categories));`.execute(db);
  await sql`select setval('oscars_nominations_id_seq', (select min(id) from oscars_nominations));`.execute(db);
  await sql`select setval('production_companies_on_movies_id_seq', (select min(id) from production_companies_on_movies));`.execute(db);
  await sql`select setval('production_companies_id_seq', (select min(id) from production_companies));`.execute(db);
  await sql`select setval('streamers_on_movies_id_seq', (select min(id) from streamers_on_movies));`.execute(db);
  await sql`select setval('streamers_id_seq', (select min(id) from streamers));`.execute(db);
}
