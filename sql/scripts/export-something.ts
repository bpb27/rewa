import { range } from 'remeda';
import { Prisma } from '../../src/prisma';
import fs from 'fs';

const prisma = Prisma.getPrisma();

const run = async () => {
  const moviesForYear = (year: string) =>
    prisma.movies.findMany({
      select: { title: true, poster_path: true, release_date: true },
      where: {
        release_date: { contains: year },
        poster_path: { not: undefined },
        NOT: {
          oscars_nominations: {
            some: {
              award: {
                category: { in: ['documentary', 'documentary_short', 'short'] },
              },
            },
          },
        },
      },
      take: 10,
    });

  const results = await Promise.all(range(1950, 2023).map(year => moviesForYear(year.toString())));
  const data = results.map(yearSet =>
    yearSet.map(movie => ({ poster: movie.poster_path, year: movie.release_date.slice(0, 4) }))
  );

  fs.writeFileSync('./something.json', JSON.stringify(data));
};

run();
