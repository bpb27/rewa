import { createTable } from '../create-tables';
import { connectToDb } from '../general';

const run = () => {
  const db = connectToDb();
  createTable(db, 'actors_on_oscars');
  createTable(db, 'crew_on_oscars');
};

run();
