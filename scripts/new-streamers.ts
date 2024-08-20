import { writeFileSync } from 'fs';
import { kyselyDb } from '../pg/db';
import { tmdbApi } from './tmbd-api';

const list: Record<
  number,
  {
    provider_name: string;
    provider_id: number;
    logo_path: string;
    movie_ids: number[];
  }
> = {};

const migration = () => `
import { type Kysely } from 'kysely';
import { tables } from './20240412045314456_lang_and_country_on_movies_tables';

export async function up(db: Kysely<any>): Promise<void> {
  await db.deleteFrom('streamers_on_movies').execute();
  await db.insertInto(tables.enum.movies).values([]).execute();
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

  const date = new Date();
  writeFileSync(
    `./pg/json/rewa-streamers-${date.toISOString().split('T')[0]}.json`,
    JSON.stringify(Object.values(list))
  );
};

run().then(() => kyselyDb.destroy());
