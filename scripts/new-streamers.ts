import { writeFileSync } from 'fs';
import { isString } from 'remeda';
import { kyselyDb } from '../pg/db';
import { timestamp } from '../pg/migration-name';
import { tmdbApi } from './tmbd-api';

const migrationName = process.argv[2];
if (!isString(migrationName)) {
  console.error('Provide a name, por ejemplo:');
  console.log('npm run migration:generate changing_shit_up');
  process.exit(1);
}

const list: Record<
  number,
  {
    provider_name: string;
    provider_id: number;
    logo_path: string;
    movie_ids: number[];
  }
> = {};

const date = new Date().toISOString().split('T')[0];

const migration = () => `
import { type Kysely } from 'kysely';
import { updateStreamers } from '../../scripts/update-streamers-for-migration';
import { DB } from '../generated';
import data from '../json/rewa-streamers-${date}.json';

export async function up(db: Kysely<DB>): Promise<void> {
  await updateStreamers(data, db);
}

export async function down(db: Kysely<any>): Promise<void> {
  // await db.deleteFrom('something').execute();
}
`;

const run = async () => {
  const movies = await kyselyDb
    .selectFrom('movies')
    .select(['movies.id as movieId', 'movies.tmdb_id as tmdbId', 'movies.title'])
    .innerJoin('episodes', 'episodes.movie_id', 'movies.id')
    .execute();

  for (let movie of movies) {
    try {
      const streamers = await tmdbApi.getMovieStreamers({ tmdbId: movie.tmdbId });
      streamers.map(streamer => {
        if (list[streamer.provider_id]) {
          list[streamer.provider_id].movie_ids.push(movie.movieId);
        } else {
          list[streamer.provider_id] = { ...streamer, movie_ids: [movie.movieId] };
        }
      });
    } catch (e) {
      console.error(`Error fetching ${movie.title}`);
    }
  }

  const dataFile = `./pg/json/rewa-streamers-${date}.json`;
  writeFileSync(dataFile, JSON.stringify(Object.values(list)));
  writeFileSync(`./pg/migrations/${timestamp()}_${migrationName}.ts`, migration());
};

run().then(() => kyselyDb.destroy());
