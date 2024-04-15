import { type Kysely } from 'kysely';
import { insertMovie } from '../../scripts/new-movie-for-migration';
import { tables } from './20240412045314456_lang_and_country_on_movies_tables';

const data = {
  tmdbId: 334541,
  title: 'Manchester by the Sea',
  episode: {
    spotifyUrl: 'https://open.spotify.com/episode/4Yqh5cqJvKsg25GUL0XiaU?si=60f377d842af4392',
    episodeOrder: 334,
    title: 'Manchester by the Sea',
    date: 'Mar 2024',
    hosts: ['Bill Simmons', 'Chris Ryan', 'Sean Fennessey'],
  },
};

export async function up(db: Kysely<any>): Promise<void> {
  await insertMovie(db, data);
}

export async function down(db: Kysely<any>): Promise<void> {
  await db
    .deleteFrom(tables.enum.episodes)
    .where('tmdb_id', '=', data.episode.spotifyUrl)
    .execute();
}
