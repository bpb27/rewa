import { type Kysely } from 'kysely';
import { insertMovie } from '../../scripts/new-movie-for-migration';
import { tables } from './20240412045314456_lang_and_country_on_movies_tables';

const data = [
  {
    tmdbId: 249,
    title: 'The War of the Roses',
    ebert: { path: '/reviews/the-war-of-the-roses-1989', rating: 3 },
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/6eikEb3398eM59pmfpW32X?si=f120a1bc86274b3e',
      episodeOrder: 336,
      title: 'The War of the Roses',
      date: 'Apr 2024',
      hosts: ['Amanda Dobbins', 'Bill Simmons', 'Mallory Rubin'],
    },
  },
  {
    tmdbId: 339692,
    title: 'Shot Caller',
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/3Zbfctc3rJ8sY16WdmEHbt?si=934dfc51cef741da',
      episodeOrder: 335,
      title: 'Shot Caller',
      date: 'Apr 2024',
      hosts: ['Bill Simmons', 'Chris Ryan'],
    },
  },
  {
    tmdbId: 11060,
    title: 'Internal Affairs',
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/3Op2biC0bdpJL3ytxTmUEy?si=c9ef5d749bef4853',
      episodeOrder: 333,
      title: 'Internal Affairs',
      date: 'Mar 2024',
      hosts: ['Bill Simmons', 'Chris Ryan', 'Van Lathan'],
    },
  },
  {
    tmdbId: 9346,
    title: 'Risky Business',
    ebert: { path: '/reviews/risky-business-1983', rating: 4 },
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/6L2CjqZiWGiBn9trkRuCPb?si=9334f5ffb2ad48eb',
      episodeOrder: 332,
      title: 'Risky Business',
      date: 'Mar 2024',
      hosts: ['Bill Simmons', 'Chris Ryan'],
    },
  },
  {
    tmdbId: 10135,
    title: 'Road House',
    ebert: { path: '/reviews/road-house-1989', rating: 2.5 },
    episode: {
      spotifyUrl: 'https://open.spotify.com/episode/50fPq9jcb71Vg7d32CiW2Q?si=b1a91fd553164185',
      episodeOrder: 331,
      title: 'Road House',
      date: 'Mar 2024',
      hosts: ['Bill Simmons', 'Chris Ryan', 'Kyle Brandt'],
    },
  },
].reverse();

export async function up(db: Kysely<any>): Promise<void> {
  await insertMovie(db, data[0]);
  await insertMovie(db, data[1]);
  await insertMovie(db, data[2]);
  await insertMovie(db, data[3]);
  await insertMovie(db, data[4]);
}

export async function down(db: Kysely<any>): Promise<void> {
  await db
    .deleteFrom(tables.enum.movies)
    .where(
      'tmdb_id',
      'in',
      data.map(m => m.tmdbId)
    )
    .execute();
}
