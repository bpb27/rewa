import {
  createOscarsNominationsTable,
  createOscarAwardNamesTable,
  createTable,
} from '../create-tables';
import { uniqBy } from 'remeda';
import allOscarsJson from '../oscars-data/all.json';
import missingOscars from '../oscars-data/missing-oscars.json';
import { awardsMap } from '../oscars-data/awards-map';
import { connectToDb, dropTable } from '../general';
import { prepareInsert } from '../insert';
import { getAllAwards, getAllMovies } from '../select';
import { tmdbApi } from '../tmdb-api';

const normalizeString = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^\w\s]|_/g, '')
    .replace(/\s+/g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const withinYearRange = (one: string | number, two: string | number): boolean =>
  Math.abs(Number(one.toString().slice(0, 4)) - Number(two.toString().slice(0, 4))) <= 5;

const run = async () => {
  const db = connectToDb();

  dropTable(db, 'oscars_nominations');
  dropTable(db, 'oscars_awards');
  createTable(db, 'oscars_awards');
  createTable(db, 'oscars_nominations');
  db.prepare(createOscarAwardNamesTable).run();
  db.prepare(createOscarsNominationsTable).run();

  const inserter = prepareInsert(db);

  awardsMap.forEach(award => inserter.oscarAward.run(award));

  const allMovies = await getAllMovies();
  const allAwards = await getAllAwards();
  const allOscars = allOscarsJson.filter(
    n => n.year_ceremony >= 1950 && n.film && allAwards.find(a => a.name === n.category)
  );

  console.log({
    totalMovies: allMovies.length,
    totalAwards: allAwards.length,
    totalNoms: allOscars.length,
  });

  const reconciliationMap: Record<string, string> = {};
  const failedMatches: typeof allOscars = [];

  allOscars.forEach((nominee, i) => {
    if (i % 100 === 0) console.log('index at ', i);

    const award = allAwards.find(award => award.name === nominee.category);
    const movie = allMovies.find(
      movie =>
        normalizeString(movie.title) === normalizeString(nominee.film) &&
        withinYearRange(movie.release_date, nominee.year_film)
    );

    if (!movie || !award) {
      failedMatches.push(nominee);
    } else {
      if (movie.title !== nominee.film) {
        reconciliationMap[movie.title] = nominee.film;
      }
      inserter.oscarNomination.run({
        ceremony_year: nominee.year_ceremony,
        film_year: nominee.year_film,
        won: nominee.winner ? 1 : 0,
        award_id: award.id,
        movie_id: movie.id,
        recipient: nominee.name,
      });
    }
  });

  // TODO: movie could have multiple awards, so ok to only fetch film once but then
  // need to find all awards that match the nom.film and loop insert
  const toReconcile = uniqBy(failedMatches, nom => nom.film).filter(
    nom => !missingOscars.find(o => o.name === nom.film)
  );

  console.log('Reconciliation map', reconciliationMap);
  console.log('First pass failures', failedMatches.length);

  const failedMatchesTwo: typeof allOscars = [];

  const reconcile = async (i: number) => {
    const nominee = toReconcile[i];
    if (!nominee) {
      console.log('Second pass failures', failedMatchesTwo.length);
      return;
    }
    try {
      const movie = await tmdbApi.getMovieByName({ name: nominee.film, year: nominee.year_film });
      reconciliationMap[movie.title] = nominee.film;
      const award = allAwards.find(award => award.name === nominee.category);
      if (movie && award) {
        inserter.oscarNomination.run({
          ceremony_year: nominee.year_ceremony,
          film_year: nominee.year_film,
          won: nominee.winner ? 1 : 0,
          award_id: award.id,
          movie_id: movie.id,
          recipient: nominee.name,
        });
      } else {
        throw new Error('Nope');
      }
    } catch (e) {
      failedMatchesTwo.push(nominee);
    }

    reconcile(i + 1);
  };

  // reconcile(0);
};

run();
