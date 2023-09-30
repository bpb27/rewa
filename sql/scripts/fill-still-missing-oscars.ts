import missingTitles from '../oscars-data/still-missing-oscars.json';
import allOscars from '../oscars-data/all.json';
import { tmdbApi } from '../tmdb-api';
import { insertNewMovie } from '../insert';
import { connectToDb } from '../general';
import { prepareInsert } from '../insert';
import { getAllAwards, getMovieByTmdbId } from '../select';

const run = async () => {
  const db = connectToDb();
  const inserter = prepareInsert(db);
  const allAwards = await getAllAwards();

  const movies = missingTitles
    .map(movie => ({
      ...movie,
      nominations: allOscars.filter(o => o.film === movie.name && o.year_film === movie.year),
    }))
    .filter(movie => movie.id);

  const stillMissing: typeof movies = [];

  const search = async (i: number) => {
    const movie = movies[i];
    if (!movie) {
      return console.log(JSON.stringify(stillMissing, null, 2));
    }

    try {
      console.log(movie.name, movie.year);

      const fetchedMovie = await tmdbApi
        .getMovieById({ tmdb_id: movie.id })
        .then(tmdbApi.parseMovieById);

      await insertNewMovie(db, fetchedMovie);
      const insertedMovie = await getMovieByTmdbId(fetchedMovie.movie.tmdb_id);
      if (!insertedMovie) throw new Error('Failed to lookup inserted movie');

      movie.nominations.map(n => {
        inserter.oscarNomination.run({
          award_id: allAwards.find(award => award.name === n.category)!.id,
          ceremony_year: n.year_ceremony,
          film_year: n.year_film,
          movie_id: insertedMovie.id,
          recipient: n.name,
          won: n.winner ? 1 : 0,
        });
      });

      console.log('Found', movie.name);
    } catch (e) {
      console.log(e);
      stillMissing.push(movie);
    }

    setTimeout(() => search(i + 1), 200);
  };

  search(0);
};

run();
