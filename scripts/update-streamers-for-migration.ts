import { Kysely } from 'kysely';
import { chunk } from 'remeda';
import { DB } from '../pg/generated';

type Data = {
  provider_name: string;
  logo_path: string;
  provider_id: number;
  movie_ids: number[];
}[];

export const updateStreamers = async (data: Data, db: Kysely<DB>) => {
  for (let streamer of data) {
    await db
      .insertInto('streamers')
      .values({
        name: streamer.provider_name,
        tmdb_id: streamer.provider_id,
        logo_path: streamer.logo_path,
      })
      .onConflict(c => c.doNothing())
      .execute();
  }

  const streamers = await db.selectFrom('streamers').selectAll().execute();

  await db.deleteFrom('streamers_on_movies').execute();

  const mapped = data
    .map(streamer =>
      streamer.movie_ids.map(movie_id => ({
        streamer_id: streamers.find(s => s.tmdb_id === streamer.provider_id)!.id,
        movie_id,
      }))
    )
    .flat()
    .filter(entry => {
      if (!entry.streamer_id) console.log('miss on', entry);
      return true;
    });

  await Promise.all(
    chunk(mapped, 5000).map(group => db.insertInto('streamers_on_movies').values(group).execute())
  );
};
