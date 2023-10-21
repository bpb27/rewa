import { createTable } from '../create-tables';
import { connectToDb } from '../general';
import { prepareInsert } from '../insert';
import data from './ebert.json';

const run = async () => {
  const db = connectToDb();
  const inserter = prepareInsert(db);

  data.forEach(item => {
    inserter.ebert_review.run({
      movie_id: item.movieId,
      path: item.reviewLink,
      rating: item.rating,
    });
  });
};

run();
