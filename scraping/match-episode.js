const fs = require('fs');
const episodes = require('./spotify2.json');
const movies = require('../movies.json');

const hash = {
  'White Men Cant Jump': 10158,
  'Bad Boys (1983)': 13633,
  'Planes, Trains, and Automobiles': 2609,
  'Tango and Cash': 9618,
  'The Re-Departed': 1422,
  "Miami Vice: Calderone's Return (Part 1 + 2)": 878335,
  Victory: 17360,
  'The 40-Year-Old Virgin': 6957,
  'Bad Boys': 9737,
  'Say Anything': 2028,
  'Love and Basketball': 14736,
  "Ocean's 12": 163,
  "Ocean's 11": 161,
  'Once Upon a Time … in Hollywood Live From Sundance': 466272,
  'When Harry Met Sally': 639,
};

const data = episodes.map((e, i) => {
  const movie = movies.find((m) =>
    e.title.toLowerCase().includes(m.title.toLowerCase())
  );
  const movieId = movie ? movie.id : hash[e.title];
  if (!movieId) console.log('could not find movie for ', e.title);
  return { ...e, id: i + 1, movieId };
});

// run script from scraping dir, or use pathname thing
fs.writeFile('./spotify3.json', JSON.stringify(data), 'utf8', (a, b) =>
  console.log(a, b)
);
