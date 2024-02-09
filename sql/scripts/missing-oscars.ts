import { getYear } from '../../src//utils/format';
import { Prisma } from '../../src/prisma';
import { connectToDb } from '../general';
import { insertNewMovie } from '../insert';
import { tmdbApi } from '../tmdb-api';

const prisma = Prisma.getPrisma();
const db = connectToDb();

const missing: {
  recipient: string;
  award_id: number;
  award_name?: string;
  ceremony_year: number;
  tmdb_id: number;
  actor_tmdb_id?: number;
  director_tmdb_id?: number;
  won: boolean;
}[] = [
  {
    award_id: 23,
    award_name: 'FOREIGN LANGUAGE FILM',
    ceremony_year: 1958,
    recipient: 'Italy',
    tmdb_id: 19426,
    won: true,
  },
  {
    award_id: 23,
    award_name: 'FOREIGN LANGUAGE FILM',
    ceremony_year: 1983,
    recipient: 'Spain',
    tmdb_id: 81346,
    won: true,
  },
  {
    award_id: 18,
    award_name: 'DOCUMENTARY (Feature)',
    ceremony_year: 1988,
    recipient: 'Aviva Slesin, Producer',
    tmdb_id: 182561,
    won: true,
  },
  {
    award_id: 18,
    award_name: 'DOCUMENTARY (Feature)',
    ceremony_year: 1989,
    recipient: 'Marcel Ophuls, Producer',
    tmdb_id: 41954,
    won: true,
  },
  {
    award_id: 52,
    award_name: 'MUSIC (Original Song)',
    ceremony_year: 1990,
    recipient:
      'Under The Sea in "The Little Mermaid" Music by Alan Menken; Lyric by Howard Ashman ',
    tmdb_id: 10144,
    won: true,
  },
  {
    award_id: 52,
    award_name: 'MUSIC (Original Song)',
    ceremony_year: 1992,
    recipient:
      'Beauty And The Beast in "Beauty and the Beast" Music by Alan Menken; Lyric by Howard Ashman ',
    tmdb_id: 10020,
    won: true,
  },
  {
    award_id: 23,
    award_name: 'FOREIGN LANGUAGE FILM',
    ceremony_year: 1994,
    recipient: 'Spain',
    tmdb_id: 2470,
    won: true,
  },
  {
    award_id: 18,
    award_name: 'DOCUMENTARY (Feature)',
    ceremony_year: 2005,
    recipient: 'Ross Kauffman and Zana Briski',
    tmdb_id: 1392,
    won: true,
  },
  {
    award_id: 45,
    award_name: 'SHORT FILM (Live Action)',
    ceremony_year: 2008,
    recipient: 'Philippe Pollet-Villard',
    tmdb_id: 116604,
    won: true,
  },
  {
    award_id: 45,
    award_name: 'SHORT FILM (Live Action)',
    ceremony_year: 2009,
    recipient: 'Jochen Alexander Freydank',
    tmdb_id: 23764,
    won: true,
  },
  {
    award_id: 52,
    award_name: 'MUSIC (Original Song)',
    ceremony_year: 2017,
    recipient: 'from La La Land; Music by Justin Hurwitz; Lyric by Benj Pasek and Justin Paul ',
    tmdb_id: 313369,
    won: true,
  },
];

const rectify = async (i: number) => {
  const toAdd = missing[i];
  if (!toAdd) return;

  const parsedMovie = await tmdbApi
    .getMovieById({ tmdb_id: toAdd.tmdb_id })
    .then(tmdbApi.parseMovieById);

  await insertNewMovie(db, parsedMovie);

  const insertedMovie = await prisma.movies.findFirstOrThrow({
    where: { tmdb_id: toAdd.tmdb_id },
    include: {
      actors_on_movies: {
        include: {
          actors: true,
        },
      },
      crew_on_movies: {
        include: {
          crew: true,
        },
      },
    },
  });

  const insertedNomination = await prisma.oscars_nominations.create({
    data: {
      ceremony_year: toAdd.ceremony_year,
      film_year: Number(getYear(insertedMovie.release_date)),
      recipient: toAdd.recipient,
      won: toAdd.won,
      movie_id: insertedMovie.id,
      award_id: toAdd.award_id,
    },
  });

  if (toAdd.actor_tmdb_id) {
    const actor = insertedMovie.actors_on_movies.find(
      aom => aom.actors.tmdb_id === toAdd.actor_tmdb_id
    );
    if (!actor?.actor_id) {
      throw new Error(`Could not find actor id ${toAdd.actor_tmdb_id} for ${insertedMovie.title}`);
    } else {
      await prisma.actors_on_oscars.create({
        data: { actor_id: actor.actor_id, oscar_id: insertedNomination.id },
      });
    }
  }

  if (toAdd.director_tmdb_id) {
    const director = insertedMovie.crew_on_movies.find(
      com => com.crew.tmdb_id === toAdd.director_tmdb_id
    );
    if (!director?.crew_id) {
      throw new Error(
        `Could not find director id ${toAdd.director_tmdb_id} for ${insertedMovie.title}`
      );
    } else {
      await prisma.crew_on_oscars.create({
        data: { crew_id: director.crew_id, oscar_id: insertedNomination.id },
      });
    }
  }

  console.log(`Added nomination for ${insertedMovie.title}`);
  rectify(i + 1);
};

rectify(0);
