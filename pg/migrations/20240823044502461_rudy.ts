import { type Kysely } from 'kysely';
import { hosts } from '../../scripts/hosts';
import { RewaPayload, insertMovie } from '../../scripts/new-movie-for-migration';
import { DB } from '../generated';
import { tables } from './20240412045314456_lang_and_country_on_movies_tables';

const data: RewaPayload = {
  tmdbId: 14534,
  ebert: {
    path: '/reviews/rudy-1993',
    rating: 3.5,
  },
  episode: {
    spotifyUrl: 'https://open.spotify.com/episode/3I4DpvRTscaQKJdZmZZ5Um?si=05dc8ce49f5b47d9',
    episodeOrder: 358,
    title: 'Rudy',
    date: 'Aug 2024',
    hosts: [hosts['Bill Simmons'], hosts['Kyle Brandt']],
  },
};

export async function up(db: Kysely<any>): Promise<void> {
  await insertMovie(db, data);
}

export async function down(db: Kysely<DB>): Promise<void> {
  if (!data.episode) return;
  await db
    .deleteFrom(tables.enum.episodes)
    .where('spotify_url', '=', data.episode.spotifyUrl)
    .execute();
}
