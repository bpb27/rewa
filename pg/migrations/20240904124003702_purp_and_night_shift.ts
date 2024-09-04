import { type Kysely } from 'kysely';
import { isString, uniq } from 'remeda';
import { hosts } from '../../scripts/hosts';
import { RewaPayload, insertMovie } from '../../scripts/new-movie-for-migration';
import { processArraySequentially } from '../../src/utils/array';
import { DB } from '../generated';
import { tables } from './20240412045314456_lang_and_country_on_movies_tables';

const data: RewaPayload[] = [
  {
    tmdbId: 14742,
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/3a7rl9hRtwZoIWz1JJQax4?si=b3bb054d1569442b',
      episodeOrder: 360,
      title: 'Night Shift',
      date: 'Sep 2024',
      hosts: [hosts['Bill Simmons'], hosts['Chris Ryan']],
    },
  },
  {
    tmdbId: 13763,
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/3ooOqCwE48ObqHkyo8YJXq?si=72f264c53b7b4a35',
      episodeOrder: 359,
      title: 'Purple Rain',
      date: 'Aug 2024',
      hosts: [hosts['Bill Simmons'], hosts['Wesley Morris']],
    },
  },
];

export async function up(db: Kysely<any>): Promise<void> {
  if (uniq(data.map(m => m.tmdbId)).length !== data.length) throw new Error('Dupe tmdbId');
  if (uniq(data.map(m => m.episode!.episodeOrder)).length !== data.length)
    throw new Error('Dupe episode order');
  if (uniq(data.map(m => m.episode!.spotifyUrl)).length !== data.length)
    throw new Error('Dupe spotify url');

  await processArraySequentially(data, async movie => {
    try {
      await insertMovie(db, movie);
    } catch (e) {
      console.log('Failure on', movie);
      throw new Error(e as any);
    }
  });
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db
    .deleteFrom(tables.enum.episodes)
    .where('spotify_url', 'in', data.map(m => m.episode?.spotifyUrl).filter(isString))
    .execute();
}
