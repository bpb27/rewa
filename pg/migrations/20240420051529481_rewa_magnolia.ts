import { type Kysely } from 'kysely';
import { hosts } from '../../scripts/hosts';
import { RewaPayload, insertMovie } from '../../scripts/new-movie-for-migration';
import { DB } from '../generated';
import { tables } from './20240412045314456_lang_and_country_on_movies_tables';

const data: RewaPayload = {
  tmdbId: 334,
  ebert: {
    path: '/reviews/great-movie-magnolia-1999',
    rating: 4,
  },
  episode: {
    spotifyUrl: 'https://open.spotify.com/episode/5TX8C2b8Gqwlc0YGntStCR?si=d0942335b1e34d8d',
    episodeOrder: 337,
    title: 'Magnolia',
    date: 'Apr 2024',
    hosts: [hosts['Bill Simmons'], hosts['Chris Ryan'], hosts['Sean Fennessey']],
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
