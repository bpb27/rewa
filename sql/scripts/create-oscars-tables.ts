import { createTable } from '../create-tables';
import allOscarsJson from '../oscars-data/all.json';
import stillMissingOscars from '../oscars-data/still-missing-oscars.json';
import { awardsMap } from '../oscars-data/awards-map';
import { connectToDb, dropTable } from '../general';
import { prepareInsert } from '../insert';
import { getAllAwards, getAllMovies } from '../select';
import { normalizeName } from '../../src/utils/format';
import { withinYearRange } from '../../src/utils/sorting';
import { isDefined, uniq } from 'remeda';

const run = async () => {
  const db = connectToDb();

  dropTable(db, 'oscars_nominations');
  dropTable(db, 'oscars_awards');
  createTable(db, 'oscars_awards');
  createTable(db, 'oscars_nominations');

  const inserter = prepareInsert(db);

  awardsMap.forEach(award => inserter.oscarAward.run(award));

  const allMovies = await getAllMovies();
  const allAwards = await getAllAwards();
  const allOscars = allOscarsJson.filter(
    n => n.year_ceremony >= 1950 && n.film && allAwards.find(a => a.name === n.category)
  );

  const titleHash = allMovies.reduce((hash, movie) => {
    const title = normalizeName(movie.title);
    if (hash[title]) {
      hash[title].push(movie);
    } else {
      hash[title] = [movie];
    }
    return hash;
  }, {} as Record<string, typeof allMovies>);

  const tmdbIdHash = allMovies.reduce((hash, movie) => {
    hash[movie.tmdb_id] = movie;
    return hash;
  }, {} as Record<number, (typeof allMovies)[number]>);

  const awardsHash = allAwards.reduce((hash, award) => {
    hash[award.name] = award;
    return hash;
  }, {} as Record<string, (typeof allAwards)[number]>);

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
  const getTmdbIdForMissingTitle = (title: string) =>
    stillMissingOscars.find(smo => smo.name === title)?.id;
  const bullshitCatgories = ['documentary', 'documentary_short', 'short', 'foreign_language'];

  allOscars.forEach((nominee, i) => {
    if (i % 100 === 0) console.log('index at ', i);

    const titleMatches =
      titleHash[normalizeName(nominee.film)] ||
      [tmdbIdHash[getTmdbIdForMissingTitle(nominee.film) || 0]].filter(isDefined);

    const movie =
      titleMatches.length === 1
        ? titleMatches[0]
        : titleMatches.find(m => withinYearRange(m.release_date, nominee.year_film));

    if (movie) {
      createNomination(nominee, movie.id);
    } else {
      if (!bullshitCatgories.includes(awardsHash[nominee.category]?.category || '')) {
        failedMatches.push(nominee);
      }
    }
  });

  console.log(
    failedMatches.length,
    JSON.stringify(
      uniq(
        failedMatches.map(
          fm =>
            `year: ${fm.year_film}, title: ${fm.film}, awards: ${
              failedMatches.filter(im => im.film === fm.film).length
            }`
        )
      ).sort(),
      null,
      2
    )
  );
};

run();
