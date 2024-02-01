import { connectToDb } from '../general';
import { prepareInsert } from '../insert';
import { getAllOscarCategories } from '../select';
import json from './all-from-csv.json';
import { categoryLookup, titleLookup } from './old-cats';

// fetch in run categories if null
// insert award and get id
// insert nom

const data = json.filter(nom => nom.year_ceremony < 1950);
let categories: Awaited<ReturnType<typeof getAllOscarCategories>>;
const db = connectToDb();
const inserter = prepareInsert(db);

const run = async (i: number) => {
  if (!categories) {
    categories = await getAllOscarCategories();
  }
  if (!data[i]) return;
  const nom = data[i];
  const lookup = titleLookup[nom.film + ' ' + nom.year_film];
  const title = lookup?.slice(0, lookup.length - 5);
  const year = lookup?.slice(lookup.length - 4);
  const categoryName = categoryLookup[nom.category];
  const categoryId = categories.find(c => c.name === categoryName)?.id;
  if (title && year && categoryId) {
  }
  run(i + 1);
};

run(0);
