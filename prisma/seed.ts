import { PrismaClient } from '@prisma/client';
import movieJson from '../movies.json';
import { Movie } from './json-types';
// import { CastCreateOneSchema } from './generated/schemas/createOneCast.schema';
// import { CrewCreateOneSchema } from './generated/schemas/createOneCrew.schema';

const prisma = new PrismaClient({
  // log: [
  //   {
  //     emit: 'event',
  //     level: 'query',
  //   },
  // ],
});

const movies = movieJson as Movie[];

const pause = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// promise.all fails due to SQLite bug, so need to execute each call sequentially
const sequentialPromises = async (
  list: any[],
  promise: (...args: any[]) => any
) => {
  for (let i = 0; i < list.length; i++) {
    const entry = list[i];
    await pause(100);
    try {
      await promise(entry);
    } catch (e: any) {
      console.log('ERROR~~~~~~~~~~~~~', list[i]);
    }
  }
};

const seed = async (movieData: Movie) => {
  const {
    genres,
    production_companies,
    credits,
    spoken_languages,
    production_countries,
    belongs_to_collection,
    ...movie
  } = movieData;

  const createdMovie = await prisma.movie.create({
    data: {
      ...movie,
      release_date: new Date(movie.release_date),
    },
  });

  const movieConnection = { connect: { id: createdMovie.id } };

  await sequentialPromises(credits.cast, ({ id, ...cast }) => {
    const data = { ...cast, Movie: movieConnection };
    // CastCreateOneSchema.parse({ data });
    return prisma.cast.create({ data });
  });

  await sequentialPromises(credits.crew, ({ id, ...crew }) => {
    const data = { ...crew, Movie: movieConnection };
    // CrewCreateOneSchema.parse({ data });
    return prisma.crew.create({ data });
  });

  await sequentialPromises(genres, (genre) =>
    prisma.genresOnMovie.create({
      data: {
        movie: { connect: { id: createdMovie.id } },
        genre: { connectOrCreate: { create: genre, where: { id: genre.id } } },
      },
    })
  );

  await sequentialPromises(production_companies, (company) =>
    prisma.productionCompanyOnMovie.create({
      data: {
        movie: { connect: { id: createdMovie.id } },
        productionCompany: {
          connectOrCreate: {
            create: company,
            where: { id: company.id },
          },
        },
      },
    })
  );
};

sequentialPromises(movies, async (movie) => {
  console.log('Inserting ', movie.title);
  await pause(100);
  await seed(movie).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}).finally(async () => {
  await prisma.$disconnect();
});
