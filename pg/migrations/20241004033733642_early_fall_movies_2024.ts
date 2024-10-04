import { type Kysely } from 'kysely';
import { isString, uniq } from 'remeda';
import { hosts } from '../../scripts/hosts';
import { RewaPayload, insertMovie } from '../../scripts/new-movie-for-migration';
import { processArraySequentially } from '../../src/utils/array';
import { DB } from '../generated';
import { tables } from './20240412045314456_lang_and_country_on_movies_tables';

const data: RewaPayload[] = [
  {
    tmdbId: 745,
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/1tHdUft59JjHfIjnYFwaaQ?si=f2830c3841dc4795',
      episodeOrder: 361,
      title: 'The Sixth Sense',
      date: 'Sep 2024',
      hosts: [hosts['Sean Fennessey'], hosts['Chris Ryan'], hosts['Jason Concepcion']],
    },
  },
  {
    tmdbId: 245891,
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/0HXROqvPXrsJa8HjW5637j?si=a8854ffb53694919',
      episodeOrder: 362,
      title: 'John Wick',
      date: 'Sep 2024',
      hosts: [hosts['Bill Simmons'], hosts['Chris Ryan'], hosts['Shea Serrano']],
    },
  },
  {
    tmdbId: 1825,
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/5UM54zYzoQTt6O4W0ZjiuC?si=923551320d544ee7',
      episodeOrder: 363,
      title: 'Over the Top',
      date: 'Sep 2024',
      hosts: [hosts['Bill Simmons'], hosts['Kyle Brandt']],
    },
  },
  {
    tmdbId: 2667,
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/1HAmJhuRG3El0mnpo2mFpa?si=929c61c819954e88',
      episodeOrder: 364,
      title: 'The Blair Witch Project',
      date: 'Oct 2024',
      hosts: [hosts['Bill Simmons'], hosts['Chris Ryan']],
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
