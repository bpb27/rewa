import {
  createOscarsNominationsTable,
  createOscarAwardNamesTable,
  createTable,
} from '../create-tables';
import { uniqBy } from 'remeda';
import allOscarsJson from '../oscars-data/all.json';
import missingOscars from '../oscars-data/missing-oscars-movies.json';
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

  const createNomination = (n: (typeof allOscars)[number], movie_id: number) => {
    inserter.oscarNomination.run({
      ceremony_year: n.year_ceremony,
      film_year: n.year_film,
      won: n.winner ? 1 : 0,
      award_id: allAwards.find(award => award.name === n.category)!.id,
      movie_id,
      recipient: n.name,
    });
  };

  console.log({
    totalMovies: allMovies.length,
    totalAwards: allAwards.length,
    totalNoms: allOscars.length,
  });

  const failedMatches: typeof allOscars = [];

  allOscars.forEach((nominee, i) => {
    if (i % 100 === 0) console.log('index at ', i);

    const movie = allMovies.find(
      movie =>
        normalizeString(movie.title) === normalizeString(nominee.film) &&
        withinYearRange(movie.release_date, nominee.year_film)
    );

    if (movie) {
      createNomination(nominee, movie.id);
    } else {
      failedMatches.push(nominee);
    }
  });

  const toReconcile = uniqBy(failedMatches, nom => nom.film).filter(
    nom => !missingOscars.find(o => o.name === nom.film)
  );

  const failedMatchesTwo: typeof allOscars = [];

  const reconcile = async (i: number) => {
    const nominee = toReconcile[i];
    console.log('reconciling', nominee?.film);
    if (!nominee) {
      return console.log(
        'Second pass failures',
        failedMatchesTwo.length,
        JSON.stringify(
          failedMatchesTwo.map(i => `${i.film} (${i.year_film})`),
          null,
          2
        )
      );
    }
    try {
      const movie = await tmdbApi.getMovieByName({ name: nominee.film, year: nominee.year_film });
      failedMatches
        .filter(fm => fm.film === nominee.film)
        .forEach(n => {
          createNomination(n, movie.id);
        });
    } catch (e) {
      failedMatchesTwo.push(nominee);
    }

    reconcile(i + 1);
  };

  reconcile(0);
};

run();
