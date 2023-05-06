const fs = require('fs');
const movies = require('../src/db/movies.json');

const apiKey = 'b8baa6afbf679be5272316804b397b28';

const relevantProviders = [
  'Netflix',
  'Amazon Prime Video',
  'Disney Plus',
  'Apple TV',
  'Hulu',
  'HBO Max',
  'Paramount Plus',
  'Starz',
  'Showtime',
];

async function getProviders(id) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${apiKey}`
  );
  const data = await response.json();
  const options = (data?.results?.US?.flatrate || [])
    .filter((p) => relevantProviders.includes(p.provider_name))
    .map((p) => p.provider_name);
  return options;
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const run = async () => {
  const data = [];
  movies.forEach(async (movie, i) => {
    const providers = await getProviders(movie.id);
    data.push({ id: movie.id, providers });
    await delay(100);
    if (i === movies.length - 1) {
      console.log(data);
      fs.writeFile('providers.json', JSON.stringify(data), 'utf8', (a, b) =>
        console.log(a, b)
      );
    }
  });
};

run();
