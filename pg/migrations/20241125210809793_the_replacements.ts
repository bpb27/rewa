import { type Kysely } from 'kysely';
import { isString } from 'remeda';
import { hosts } from '../../scripts/hosts';
import { RewaPayload, insertMovie, verifyRewaList } from '../../scripts/new-movie-for-migration';
import { processArraySequentially } from '../../src/utils/array';
import { DB } from '../generated';
import { tables } from './20240412045314456_lang_and_country_on_movies_tables';

const data: RewaPayload[] = [
  {
    tmdbId: 10393,
    ebert: {
      path: '/reviews/the-replacements-2000',
      rating: 2,
    },
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/5eV2y6gJteFZc6Cadhg1h8?si=261bcd01e4454c5c',
      episodeOrder: 370,
      title: 'The Replacements',
      date: 'Nov 2024',
      hosts: [hosts['Bill Simmons'], hosts['Van Lathan']],
    },
  },
];

export async function up(db: Kysely<any>): Promise<void> {
  verifyRewaList(data);

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
