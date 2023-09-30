import { createTable } from '../create-tables';
import { connectToDb, dropTable } from '../general';
import { tmdbApi } from '../tmdb-api';
import { getAllMoviesWithEpisodes, getAllStreamers } from '../select';
import { prepareInsert } from '../insert';

const run = async () => {
  const db = connectToDb();
  const movies = await getAllMoviesWithEpisodes();
  const allStreamers = await getAllStreamers();

  const inserter = prepareInsert(db);
  dropTable(db, 'streamers_on_movies');
  createTable(db, 'streamers_on_movies');

  const add = async (i: number) => {
    const movie = movies[i];
    if (!movie) return;

    const streamers = await tmdbApi.getStreamersForMovie({ tmdb_id: movie.tmdb_id });
    console.log('inserting for ', movie.title, streamers);

    streamers.forEach(streamer => {
      const streamer_id = allStreamers.find(s => s.name === streamer)?.id;
      if (streamer_id) {
        inserter.streamerOnMovie.run({ movie_id: movie.id, streamer_id });
      } else {
        console.error(`Missed adding ${streamer} on ${movie.title}`);
      }
    });

    setTimeout(() => add(i + 1), 200);
  };

  add(0);
};

run();
