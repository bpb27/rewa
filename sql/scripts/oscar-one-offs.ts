import allOscars from '../oscars-data/all.json';
import { tmdbApi } from '../tmdb-api';
import { insertNewMovie } from '../insert';
import { connectToDb } from '../general';
import { prepareInsert } from '../insert';
import { getAllAwards, getMovieByTmdbId } from '../select';

// pull from allOscars file
const title = 'Sunset Blvd.';
const year = 1950;
// lookup via tmdb.org
const tmdb_id = 599;

const run = async () => {
  const db = connectToDb();
  const inserter = prepareInsert(db);
  const allAwards = await getAllAwards();
  const nominations = allOscars.filter(o => o.film === title && o.year_film === year);

  try {
    console.log('nominations found', nominations.length);

    const fetchedMovie = await tmdbApi.getMovieById({ tmdb_id }).then(tmdbApi.parseMovieById);

    await insertNewMovie(db, fetchedMovie);
    const insertedMovie = await getMovieByTmdbId(tmdb_id);
    if (!insertedMovie) throw new Error('Failed to lookup inserted movie');

    nominations.map(n => {
      inserter.oscarNomination.run({
        award_id: allAwards.find(award => award.name === n.category)!.id,
        ceremony_year: n.year_ceremony,
        film_year: n.year_film,
        movie_id: insertedMovie.id,
        recipient: n.name,
        won: n.winner ? 1 : 0,
      });
    });

    console.log('Success');
  } catch (e) {
    console.log(e);
  }
};

run();
