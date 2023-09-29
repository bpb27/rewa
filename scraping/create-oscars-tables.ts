import { Prisma } from '~/prisma';
import { createOscarsNominationsTable, createOscarAwardNamesTable } from '../sql/create-tables';
import { parseOscarCsv, awardMap, getMovie } from './parse-oscars';
import { uniqBy } from 'remeda';
import missingOscars from './missing-oscars.json';
import { connectToDb, dropTable } from '../sql/general';
import { prepareInsert } from '../sql/insert';

const prisma = Prisma.getPrisma();
const db = connectToDb();
const inserter = prepareInsert(db);

dropTable(db, 'oscars_nominations');
dropTable(db, 'oscars_awards');
db.prepare(createOscarAwardNamesTable).run();
db.prepare(createOscarsNominationsTable).run();

parseOscarCsv().then(async result => {
  type Nominee = (typeof result)[number];

  awardMap.forEach(award => inserter.oscarAward(award));

  const allMovies = await prisma.movies.findMany({
    select: { id: true, title: true, release_date: true, tmdb_id: true },
  });

  const findMovie = (nominee: Nominee) =>
    allMovies.find(
      movie =>
        movie.title.toLowerCase() === nominee.film_name.toLowerCase() &&
        Math.abs(Number(movie.release_date.slice(0, 4)) - nominee.film_year) <= 5
    );

  const allAwards = await prisma.oscars_awards.findMany();
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
      inserter.oscarNomination({
        ...nominee,
        won: nominee.won ? 1 : 0,
        award_id: award.id,
        movie_id: movie.id,
        recipient: nominee.person_name,
      });
    }
  });

  const unmatched = uniqBy(cantMatchTitle, n => n.film_name);

  const tryToMatchMissingTitles = async (i: number) => {
    const nom = unmatched[i];
    if (!nom) return;
    try {
      const result = (await getMovie(nom)) as { id: number };
      const movie = allMovies.find(m => m.tmdb_id === result.id);
      const award = findAward(nom);
      if (movie && award) {
        inserter.oscarNomination({
          ...nom,
          won: nom.won ? 1 : 0,
          award_id: award.id,
          movie_id: movie.id,
          recipient: nom.person_name,
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
