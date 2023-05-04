const movies = require('./movies.json');
const fs = require('fs');

const movieIdsList = [];
const movieIdsSet = new Set();
const castIdsList = [];
const castIdsSet = new Set();
const creditIdsList = [];
const creditIdsSet = new Set();

movies.forEach((m) => {
  movieIdsList.push(m.id);
  movieIdsSet.add(m.id);
  m.credits.cast.forEach((c) => {
    castIdsList.push(c.id);
    castIdsSet.add(c.id);
    creditIdsList.push(c.credit_id);
    creditIdsSet.add(c.credit_id);
  });
});

console.log('movies', movieIdsList.length, movieIdsSet.size);
console.log('cast', castIdsList.length, castIdsSet.size);
console.log('credit', creditIdsList.length, creditIdsSet.size);

// const idSet = new Set(movies.map((m) => m.id));
// const uniqueList = [];
// idSet.forEach((id) => {
//   const movie = movies.find((m) => m.id === id);
//   if (!movie) console.log('SHITE!!!');
//   uniqueList.push(movie);
// });

// fs.writeFile('myjsonfile.json', JSON.stringify(uniqueList), 'utf8', (a, b) =>
//   console.log(a, b)
// );

// ids.forEach((num) => {
//   if (idSet.has(num)) {
//     console.log('duplicate', num);
//     console.log(movies.find((m) => m.id === num)?.title);
//   } else {
//     idSet.add(num);
//   }
// });
// console.log(JSON.stringify(movies[0], null, 2));
