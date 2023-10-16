import { createTable } from '../create-tables';
import { connectToDb, dropTable } from '../general';
import { prepareInsert } from '../insert';
import data from '../oscars-data/oscars.json';
import { categories } from '../oscars-data/categories';
import { awardsMap } from '../../src/data/awards-map';

const run = async () => {
  const db = connectToDb();
  dropTable(db, 'oscars_nominations');
  dropTable(db, 'oscars_awards');
  dropTable(db, 'oscars_categories');
  createTable(db, 'oscars_nominations');
  createTable(db, 'oscars_awards');
  createTable(db, 'oscars_categories');
  const inserter = prepareInsert(db);

  const awardsHash: Record<string, number> = {};

  categories.forEach(category => {
    const { lastInsertRowid: categoryId } = inserter.oscarCategory.run(category);
    awardsMap
      .filter(award => award.category === category.name)
      .forEach(award => {
        const { lastInsertRowid } = inserter.oscarAward.run({
          name: award.name,
          category_id: categoryId as number,
        });
        awardsHash[award.name] = lastInsertRowid as number;
      });
  });

  data.forEach((nomination, i) => {
    if (i % 1000 === 0) console.log('noms batch', i);
    inserter.oscarNomination.run({
      actor_id: null,
      award_id: awardsHash[nomination.awardName],
      ceremony_year: nomination.ceremonyYear,
      crew_id: null,
      film_year: nomination.movieYear,
      movie_id: nomination.movieRewaId,
      recipient: nomination.awardRecipient,
      won: nomination.awardWon ? 1 : 0,
    });
  });
};

run();
