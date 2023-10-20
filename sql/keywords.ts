import { tmdbApi } from './tmdb-api';
import { getAllMovies, getKeywordByName } from './select';
import { connectToDb } from './general';
import { prepareInsert } from './insert';

const run = async () => {
  const db = connectToDb();
  const inserter = prepareInsert(db);

  const movies = await getAllMovies();

  // @ts-ignore
  const addKeywords = async (i: number) => {
    const movie = movies[i];
    if (!movie) return console.log('DONE');

    const response = await tmdbApi.getMovieKeywordsById({ tmdb_id: movie.tmdb_id });
    if (!response || !response.keywords) {
      console.log('Unable to get keywords for ', movie.title);
      return addKeywords(i + 1);
    }
    response.keywords.forEach(({ name }) => {
      inserter.keyword.run({ name });
    });
    const keywords = await Promise.all(
      response.keywords.map(keyword => getKeywordByName(keyword.name))
    );
    keywords.forEach(keyword => {
      inserter.keywordsOnMovie.run({ keyword_id: keyword?.id!, movie_id: movie.id });
    });
    console.log(`keywords for ${movie.title}`, response.keywords.length);
    addKeywords(i + 1);
  };

  addKeywords(0);
};

run();
