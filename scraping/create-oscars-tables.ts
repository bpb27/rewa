import Database from 'better-sqlite3';
import { createOscarsNominationsTable, createOscarAwardNamesTable } from '../sql/create-tables';
import { parseOscarCsv, awardMap, getMovie } from './parse-oscars';
import { insert } from '../sql/new-movie';
import { uniq, uniqBy } from 'remeda';
import missingOscars from './missing-oscars.json';

const db = new Database('./prisma/db.sqlite', {
  readonly: false,
  timeout: 5000,
});

db.exec('DROP TABLE IF EXISTS oscars_nominations');
db.exec('DROP TABLE IF EXISTS oscars_awards');
db.prepare(createOscarAwardNamesTable).run();
db.prepare(createOscarsNominationsTable).run();

const getAllMovies = db.prepare(`
  SELECT id, title, release_date, tmdb_id FROM movies;
`);

const getAllAwards = db.prepare(`
  SELECT * FROM oscars_awards;
`);

const insertAward = db.prepare(insert('oscars_awards', ['name', 'category']));

const insertNomination = db.prepare(
  insert('oscars_nominations', ['film_year', 'ceremony_year', 'won', 'movie_id', 'award_id'])
);

parseOscarCsv().then(result => {
  type Nominee = (typeof result)[number];

  awardMap.forEach(award => insertAward.run(award));

  const allMovies = getAllMovies.all() as {
    id: number;
    title: string;
    release_date: string;
    tmdb_id: string;
  }[];
  const findMovie = (nominee: Nominee) =>
    allMovies.find(
      movie =>
        movie.title.toLowerCase() === nominee.film_name.toLowerCase() &&
        Math.abs(Number(movie.release_date.slice(0, 4)) - nominee.film_year) <= 5
    );

  const allAwards = getAllAwards.all() as { id: number; name: string; category: string }[];
  const findAward = (nominee: Nominee) =>
    allAwards.find(award => award.category === nominee.award_category && award.name === award.name);

  const cantMatchTitle: typeof result = [];

  result.forEach(nominee => {
    const movie = findMovie(nominee);
    const award = findAward(nominee);

    if (!movie || !award) {
      if (!missingOscars.find(o => o.name === nominee.film_name)) {
        cantMatchTitle.push(nominee);
      }
    } else {
      insertNomination.run({
        ...nominee,
        won: nominee.won ? 1 : 0,
        award_id: award.id,
        movie_id: movie.id,
      });
    }
  });

  const unmatched = uniqBy(cantMatchTitle, n => n.film_name);

  const tryToMatchMissingTitles = async (i: number) => {
    const nom = unmatched[i];
    if (!nom) return;
    try {
      const result = (await getMovie(nom)) as { id: string };
      const movie = allMovies.find(m => m.tmdb_id === result.id);
      const award = findAward(nom);
      if (movie && award) {
        insertNomination.run({
          ...nom,
          won: nom.won ? 1 : 0,
          award_id: award.id,
          movie_id: movie.id,
        });
      } else {
        console.log('Failed reconciliation', nom.film_name);
      }
    } catch (e) {
      console.log('Failed reconciliation', nom.film_name);
    }
  };

  tryToMatchMissingTitles(0);
});
