import { type Kysely } from 'kysely';
import { isString, uniq } from 'remeda';
import { hosts } from '../../scripts/hosts';
import { RewaPayload, insertMovie } from '../../scripts/new-movie-for-migration';
import { processArraySequentially } from '../../src/utils/array';
import { DB } from '../generated';
import { tables } from './20240412045314456_lang_and_country_on_movies_tables';

const data: RewaPayload[] = [
  {
    tmdbId: 120467,
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/3REUPhfygNUYtoVz6KRf9X?si=13ae9ebffa304d10',
      episodeOrder: 357,
      title: 'The Grand Budapest Hotel',
      date: 'Aug 2024',
      hosts: [hosts['Chris Ryan'], hosts['Sean Fennessey'], hosts['Andy Greenwald']],
    },
  },
  {
    tmdbId: 9472,
    ebert: {
      path: '/reviews/dodgeball-a-true-underdog-story-2004',
      rating: 3,
    },
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/7vboDeXEAy7fdjOsCxOObI?si=93b3d1f27a4b413a',
      episodeOrder: 356,
      title: 'Dodgeball',
      date: 'Aug 2024',
      hosts: [hosts['Craig Horlbeck'], hosts['Danny Heifetz'], hosts['Danny Kelly']],
    },
  },
  {
    tmdbId: 680,
    ebert: {
      path: '/reviews/great-movie-pulp-fiction-1994',
      rating: 4,
    },
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/5mEvlXe222QVrYPE23Om3r?si=5f31c38ced2a4b7f',
      episodeOrder: 355,
      title: 'Pulp Fiction',
      date: 'Jul 2024',
      hosts: [hosts['Bill Simmons'], hosts['Chris Ryan'], hosts['Sean Fennessey']],
    },
  },
  {
    tmdbId: 10083,
    ebert: {
      path: '/reviews/no-way-out-1987',
      rating: 4,
    },
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/3l56NfyCNQYi09lYKs4mZT?si=6330da35529c4640',
      episodeOrder: 354,
      title: 'No Way Out',
      date: 'Jul 2024',
      hosts: [hosts['Bill Simmons'], hosts['Chris Ryan'], hosts['Sean Fennessey']],
    },
  },
  {
    tmdbId: 509,
    ebert: {
      path: '/reviews/notting-hill-1999',
      rating: 3,
    },
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/455t8aRlWTaEHRL878CmJC?si=90de8af7f5bb4276',
      episodeOrder: 353,
      title: 'Notting Hill',
      date: 'Jul 2024',
      hosts: [hosts['Juliet Litman'], hosts['Amanda Dobbins']],
    },
  },
  {
    tmdbId: 36955,
    ebert: {
      path: '/reviews/true-lies-1994',
      rating: 3,
    },
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/0lGTUuucjdHpGf2gvTdiwD?si=9218dbbcb01e494c',
      episodeOrder: 352,
      title: 'True Lies',
      date: 'Jul 2024',
      hosts: [hosts['Bill Simmons'], hosts['Chris Ryan'], hosts['Van Lathan']],
    },
  },
  {
    tmdbId: 10390,
    ebert: {
      path: '/reviews/for-love-of-the-game-1999',
      rating: 1.5,
    },
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/2f9ek7yecA4nSBRrjRSCjG?si=1cb7f09835d54941',
      episodeOrder: 351,
      title: 'For the Love of the Game',
      date: 'Jul 2024',
      hosts: [hosts['Bill Simmons'], hosts['Mallory Rubin']],
    },
  },
  {
    tmdbId: 664,
    ebert: {
      path: '/reviews/twister-1996',
      rating: 2.5,
    },
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/5DZeCSVmeMNUt1ygV8t7m2?si=cd17981396044335',
      episodeOrder: 350,
      title: 'Twister',
      date: 'Jul 2024',
      hosts: [hosts['Bill Simmons'], hosts['Chris Ryan'], hosts['Van Lathan']],
    },
  },
  {
    tmdbId: 817,
    ebert: {
      path: '/reviews/austin-powers-the-spy-who-shagged-me-1999',
      rating: 2.5,
    },
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/0cPL1z9pZC2ajoMSTNMoAM?si=f787d0b5dc42405f',
      episodeOrder: 349,
      title: 'Austin Powers: The Spy Who Shagged Me',
      date: 'Jul 2024',
      hosts: [hosts['Bill Simmons'], hosts['Sean Fennessey']],
    },
  },
  {
    tmdbId: 37136,
    ebert: {
      path: '/reviews/the-naked-gun-1988',
      rating: 3.5,
    },
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/5QQItYeuAmSQz88WYPvOFs?si=7f61d6663a784fb9',
      episodeOrder: 348,
      title: 'The Naked Gun',
      date: 'Jul 2024',
      hosts: [hosts['Bill Simmons'], hosts['Kyle Brandt']],
    },
  },
  {
    tmdbId: 9032,
    ebert: {
      path: '/reviews/big-daddy-1999',
      rating: 1.5,
    },
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/3qLyhJHo71xFVy5Towut8v?si=316c06d878cd4354',
      episodeOrder: 347,
      title: 'Big Daddy',
      date: 'Jun 2024',
      hosts: [hosts['Bill Simmons'], hosts['Joe House'], hosts['Sean Fennessey']],
    },
  },
  {
    tmdbId: 23479,
    ebert: {
      path: '/reviews/the-bad-news-bears-1976',
      rating: 3,
    },
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/4SZ5sq47BR3xG5fBefTW6m?si=b248147fcbc545cc',
      episodeOrder: 346,
      title: 'Bad News Bears',
      date: 'Jun 2024',
      hosts: [hosts['Bill Simmons'], hosts['Van Lathan']],
    },
  },
  {
    tmdbId: 4985,
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/6hqA1KiWKhFnPAjTZCn4Cr?si=6e7000f5a2664960',
      episodeOrder: 345,
      title: 'The Longest Yard',
      date: 'Jun 2024',
      hosts: [hosts['Bill Simmons'], hosts['Chris Ryan'], hosts['Van Lathan']],
    },
  },
  {
    tmdbId: 20283,
    ebert: {
      path: '/reviews/breaking-away-1979',
      rating: 4,
    },
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/5HdBr73u5IJatuzm3xXkPI?si=4512bcafabe24a60',
      episodeOrder: 344,
      title: 'Breaking Away',
      date: 'Jun 2024',
      hosts: [hosts['Bill Simmons'], hosts['Chris Ryan'], hosts['Sean Fennessey']],
    },
  },
  {
    tmdbId: 11590,
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/7JN2MZR07I1MomMsEFofY3?si=cfb3bae04bff4031',
      episodeOrder: 343,
      title: 'Slap Shot',
      date: 'Jun 2024',
      hosts: [hosts['Bill Simmons'], hosts['Chris Ryan'], hosts['Sean Fennessey']],
    },
  },
  {
    tmdbId: 13342,
    ebert: {
      path: '/reviews/fast-times-at-ridgemont-high-1982',
      rating: 1,
    },
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/2hxnAdCsc2WU7G4CZziJM1?si=76a9591460944b74',
      episodeOrder: 342,
      title: 'Fast Times at Ridgemont High',
      date: 'May 2024',
      hosts: [hosts['Bill Simmons'], hosts['Chris Ryan'], hosts['Mallory Rubin']],
    },
  },
  {
    tmdbId: 165,
    ebert: {
      path: '/reviews/back-to-the-future-part-ii-1989',
      rating: 3,
    },
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/5cKG7lAy5XY8Ivt4jXptYG?si=25341e49349344cd',
      episodeOrder: 341,
      title: 'Back to the Future Part II',
      date: 'May 2024',
      hosts: [hosts['Bill Simmons'], hosts['Chris Ryan'], hosts['Cousin Sal']],
    },
  },
  {
    tmdbId: 5966,
    ebert: {
      path: '/reviews/along-came-polly-2004',
      rating: 2,
    },
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/4NKQ8NzI8mMBlat7z2Mj1p?si=c0f474fc1aa54e37',
      episodeOrder: 340,
      title: 'Along Came Polly',
      date: 'May 2024',
      hosts: [hosts['Bill Simmons'], hosts['Sean Fennessey']],
    },
  },
  {
    tmdbId: 865,
    ebert: {
      path: '/reviews/the-running-man-1987',
      rating: 2.5,
    },
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/0aR0JiuN6GPSSFKRCtBUUn?si=b3b32fe6511648a6',
      episodeOrder: 339,
      title: 'The Running Man',
      date: 'Apr 2024',
      hosts: [hosts['Bill Simmons'], hosts['Kyle Brandt']],
    },
  },
  {
    tmdbId: 42172,
    ebert: {
      path: '/reviews/hardcore-1979',
      rating: 4,
    },
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/3A0oqkQfKQCRgqqgsGWnZX?si=88ba413d4d4b40fc',
      episodeOrder: 338,
      title: 'Hardcore',
      date: 'Apr 2024',
      hosts: [hosts['Bill Simmons'], hosts['Chris Ryan'], hosts['Sean Fennessey']],
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
