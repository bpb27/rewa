import { type Kysely } from 'kysely';
import { isString } from 'remeda';
import { hosts } from '../../scripts/hosts';
import { RewaPayload, insertMovie, verifyRewaList } from '../../scripts/new-movie-for-migration';
import { processArraySequentially } from '../../src/utils/array';
import { DB } from '../generated';
import { tables } from './20240412045314456_lang_and_country_on_movies_tables';

const data: RewaPayload[] = [
  {
    tmdbId: 1597,
    ebert: {
      path: '/reviews/meet-the-parents-2000',
      rating: 3,
    },
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/7vsYQKD3gGxiW59faHskko?si=e885a7c24a50468a',
      episodeOrder: 369,
      title: 'Meet the Parents',
      date: 'Nov 2024',
      hosts: [hosts['Bill Simmons'], hosts['Kyle Brandt']],
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
