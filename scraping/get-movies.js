const fs = require('fs');
const ids = require('./tmdb-ids.json');

const apiKey = '';

async function exchangeId(id) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=credits`
  );
  const data = await response.json();
  if (data && data.title) {
    return data;
  }
  console.log('failed to find', id);
  return null;
}

const exchangeIds = async () => {
  const result = await Promise.all(
    ids.map(async (id) => {
      return exchangeId(id);
    })
  );
  console.log(result);
  return result;
};

const run = async () => {
  const data = await exchangeIds(ids);
  fs.writeFile('myjsonfile.json', JSON.stringify(data), 'utf8', (a, b) =>
    console.log(a, b)
  );
};

run();
