import { type Kysely } from 'kysely';
import { isString } from 'remeda';
import { hosts } from '../../scripts/hosts';
import { RewaPayload, insertMovie, verifyRewaList } from '../../scripts/new-movie-for-migration';
import { processArraySequentially } from '../../src/utils/array';
import { DB } from '../generated';
import { tables } from './20240412045314456_lang_and_country_on_movies_tables';

const data: RewaPayload[] = [
  {
    tmdbId: 609,
    ebert: {
      path: '/reviews/poltergeist-1982',
      rating: 3,
    },
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/488LmqD3gcFZeHIgl8YwQE?si=2e221c9102e34845',
      episodeOrder: 365,
      title: 'Poltergeist',
      date: 'Oct 2024',
      hosts: [hosts['Bill Simmons'], hosts['Van Lathan']],
    },
  },
  {
    tmdbId: 493922,
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/4Te9bMtFbvyLswsHDlcZD5?si=9c081976bfb444cd',
      episodeOrder: 366,
      title: 'Hereditary',
      date: 'Oct 2024',
      hosts: [hosts['Bill Simmons'], hosts['Chris Ryan'], hosts['Sean Fennessey']],
    },
  },
  {
    tmdbId: 11357,
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/4Te9bMtFbvyLswsHDlcZD5?si=dd5a52dc5c8041bc',
      episodeOrder: 367,
      title: 'Halloween 4',
      date: 'Oct 2024',
      hosts: [hosts['Bill Simmons'], hosts['Chris Ryan'], hosts['Van Lathan']],
    },
  },
  {
    tmdbId: 11507,
    ebert: {
      path: '/reviews/body-double-1984',
      rating: 3.5,
    },
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/0eaj9TUmklb8vi9RhLfDAR?si=d197058f3497470f',
      episodeOrder: 368,
      title: 'Body Double',
      date: 'Nov 2024',
      hosts: [hosts['Bill Simmons'], hosts['Chris Ryan'], hosts['Sean Fennessey']],
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
