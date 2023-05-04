const data = require('./movies.json');

const directors = {};
const actors = {};

const upsert = (hash, entry, movie) => {
  if (hash[entry.id]) {
    hash[entry.id] = {
      name: entry.name,
      num: hash[entry.id].num + 1,
      movies: [...hash[entry.id].movies, movie.title],
    };
  } else {
    hash[entry.id] = {
      name: entry.name,
      num: 1,
      movies: [movie.title],
    };
  }
};

const sortHash = (hash, limit = 10) => {
  const sorted = Object.values(hash)
    .sort((a, b) => b.num - a.num)
    .slice(0, limit);
  console.log(sorted);
  return sorted;
};

data.forEach((movie) => {
  const director = movie.credits.crew.find((c) => c.job === 'Director');
  upsert(directors, director, movie);
  movie.credits.cast.forEach((actor) => upsert(actors, actor, movie));
});

// sortHash(directors);
sortHash(actors, 20);
