import { connectToDb } from '../general';
import json from './all-from-csv.json';
import { titleLookup } from './old-cats';

const set = new Set();
const data = json.filter(o => o.year_ceremony < 1950);

const missed: typeof json = [];
const db = connectToDb();

const run = async (i: number) => {
  const nom = data[i];
  if (!nom) {
    console.log(JSON.stringify(missed, null, 2));
    console.log('Missed ', missed.length);
    console.log('Hit ', data.length - missed.length);
    return;
  }
  const title = titleLookup[nom.film + ' ' + nom.year_film];
  if (!title) missed.push(nom);
  run(i + 1);
};

run(0);

// const run = async (i: number) => {
//   const nom = data[i];

//   if (!nom) {
//     console.log(JSON.stringify(missed));
//     console.log('Missed ', missed.length);
//     return;
//   }

//   const key = `${nom.film} | ${nom.year_film}`;

//   if (!set.has(key) && nom.film) {
//     try {
//       const result = await tmdbApi.getMovieByName({ name: nom.film, year: nom.year_film });
//       const parsedMovie = await tmdbApi
//         .getMovieById({ tmdb_id: result.id })
//         .then(tmdbApi.parseMovieById);
//       await insertNewMovie(db, parsedMovie);
//       set.add(key);
//       // prettier-ignore
//       console.log(`Added ${parsedMovie.movie.title} (${parsedMovie.movie.release_date.substring(0,4 )}) from nom ${nom.film} ${nom.year_film}`);
//     } catch (e) {
//       missed.push(nom);
//     }
//   }

//   run(i + 1);
// };

// run(0);

/**
  search for movie
  add movie to db
  
  add oscar_nom
  add actors/crew to nom
*/
