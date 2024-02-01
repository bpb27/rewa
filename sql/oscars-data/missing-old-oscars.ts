import { connectToDb } from '../general';
import { insertNewOscarNom } from '../insert';
import { getAllMovies, getAllOscarCategories } from '../select';
import json from './all-from-csv.json';
import { categoryLookup, titleLookup } from './old-cats';

const data = json.filter(nom => nom.year_ceremony < 1950);
const db = connectToDb();
let categories: Awaited<ReturnType<typeof getAllOscarCategories>>;
let movies: Awaited<ReturnType<typeof getAllMovies>>;
const misses: string[] = [];

const run = async (i: number) => {
  if (!categories) {
    categories = await getAllOscarCategories();
  }
  if (!movies) {
    movies = await getAllMovies();
  }
  if (!data[i]) {
    console.log(JSON.stringify(misses, null, 2));
    console.log('Missed', misses.length);
    return;
  }
  const nom = data[i];
  const lookup = titleLookup[nom.film.replace(';', '') + ' ' + nom.year_film];
  const title = lookup?.slice(0, lookup.length - 5).replace(';', '');
  const year = lookup?.slice(lookup.length - 4);
  const categoryName = categoryLookup[nom.category];
  const categoryId = categories.find(c => c.name === categoryName)?.id;
  const movieId = movies.find(m => m.title === title && m.release_date.startsWith(year))?.id;
  if (movieId && categoryId) {
    await insertNewOscarNom({
      db,
      award_name: nom.category,
      category_id: categoryId,
      nomination: {
        ceremony_year: nom.year_ceremony,
        film_year: nom.year_film,
        movie_id: movieId,
        recipient: nom.name,
        won: nom.winner ? 1 : 0,
      },
    });
    console.log(`added ${title} ${categoryName}`);
  }
  run(i + 1);
};

run(0);
