import fs from 'fs';
import { Prisma } from '../../src/prisma';
import { getYear } from '../../src/utils/format';

const prisma = Prisma.getPrisma();

const run = async () => {
  const data = await prisma.oscars_nominations.findMany({
    include: {
      award: {
        include: { oscars_categories: true },
      },
      movie: {
        select: { tmdb_id: true, imdb_id: true, title: true, release_date: true },
      },
    },
    orderBy: { film_year: 'desc' },
  });

  const mapped = data.map(nomination => ({
    awardCategory: nomination.award.oscars_categories.name,
    awardName: nomination.award.name,
    awardRecipient: nomination.recipient,
    awardWon: nomination.won,
    ceremonyYear: nomination.ceremony_year,
    movieImdbId: nomination.movie.imdb_id,
    movieName: nomination.movie.title,
    movieRewaId: nomination.movie_id,
    movieTmdbId: nomination.movie.tmdb_id,
    movieYear: Number(getYear(nomination.movie.release_date)),
  }));

  console.log('Found', mapped.length);

  fs.writeFileSync('./sql/oscars-data/oscars.json', JSON.stringify(mapped));
};

run();
