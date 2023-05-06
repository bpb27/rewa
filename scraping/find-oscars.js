const oscarJson = require('../src/db/oscars.json');
const moviesJson = require('../src/db/movies.json');

const allFilmNames = new Set(
  oscarJson
    .map((year) =>
      year.awards.map((cat) => cat.nominees.map((nom) => nom.film))
    )
    .flat()
    .flat()
);

const allCategories = new Set(
  oscarJson
    .map((year) => year.awards.map((a) => a.category))
    .flat()
    .flat()
);

console.log(allCategories);
