import { uniq } from 'remeda';
import stringComp from 'string-comparison';
import { Prisma } from '../../src/prisma';

const stringMatch = (str: string, strs: string[]) => {
  const cos = stringComp.cosine;
  const matched = cos.sortMatch(str, strs);
  const selection = matched[matched.length - 1];
  return selection;
};

const prisma = Prisma.getPrisma();

const splitter = /,\s*|\s+and\s+|&\s*|;\s*/;
const phrases = [
  'Original story by',
  'Original Story by',
  'Screen story by',
  'Adaptation by',
  'Adaptation score by',
  'Adaptation Score by',
  'Adapted for the screen by',
  'Art Direction:',
  'Based on a story by',
  'in collaboration with',
  'Interior Decoration:',
  'Jr.',
  'Lyric by',
  'Lyrics by',
  'Music and Lyric by',
  'Music and',
  'Music by',
  'Photographic Effects by',
  'Producer',
  'Producers',
  'Production Design:',
  'Story and Screenplay by',
  'Screenplay -',
  'Screenplay and Dialogue by ',
  'Dialogue by',
  'Screenplay by',
  'Set Decoration:',
  'Sound Director',
  'Sound Effects by',
  'Special Audible Effects by',
  'Special Visual Effects by',
  'Special Visual Effects by',
  'Sr.',
  'Story by',
  'Written by',
  'Written for the screen by',
  'Written for the Screen by',
  'Stories by',
];

const psoods: Record<string, string> = {
  'Roderick Jaynes': 'Joel Coen',
  'Dan Hanley': 'Daniel P. Hanley',
  'Stewart Linder': 'Stu Linder',
  'Jerry Greenberg': 'Gerald B. Greenberg',
  'John Link': 'John F. Link Sr.',
};

// for people that aren't linked on crew but end up string matching
const ignore = ['fake'];

const run = async (realRun: boolean) => {
  const noms = await prisma.oscars_nominations.findMany({
    include: { movie: true },
    orderBy: { ceremony_year: 'desc' },
    where: {
      award: {
        category_id: { in: [11] },
      },
    },
  });

  const movies = await prisma.movies.findMany({
    select: {
      id: true,
      crew_on_movies: {
        select: {
          crew: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });

  const guesses = noms.map(n => {
    const cleaned = phrases.reduce(
      (cleanStr, phrase) => cleanStr.replaceAll(phrase, ''),
      n.recipient
    );
    return {
      movieTitle: n.movie.title,
      ceremonyYear: n.ceremony_year,
      nomId: n.id,
      movieId: n.movie_id,
      recipient: cleaned,
      full: n.recipient,
      names: cleaned
        .split(splitter)
        .map(s => s.trim())
        .filter(Boolean),
    };
  });

  const hitsForReview: string[] = [];
  const misses: string[] = [];

  const stuff = guesses.map(guess => {
    const movie = movies.find(m => m.id === guess.movieId);
    if (!movie) throw new Error('no movie');

    const crewNameToId = movie.crew_on_movies.reduce(
      (h, p) => ({ ...h, [p.crew.name]: p.crew.id }),
      {} as Record<string, number>
    );
    const crewIdToName = movie.crew_on_movies.reduce(
      (h, p) => ({ ...h, [p.crew.id]: p.crew.name }),
      {} as Record<number, string>
    );
    const crewNameList = Object.keys(crewNameToId);

    return guess.names.map(name => {
      // direct name match (recipient chunk to crew member) - also check known pseudonym
      let crewId = crewNameToId[name] || crewNameToId[psoods[name] || 'NOPE'];

      // try indirect string comparisons
      if (!crewId) {
        const attempt = stringMatch(name, crewNameList);
        if (attempt && attempt.rating >= 0.8 && !ignore.includes(name)) {
          if (
            !(name === 'Patrizia Von Brandenstein' && attempt.member === 'Bette Iverson') &&
            !(name === 'Philip W. Anderson' && attempt.member === 'Richard L. Wilson') &&
            !(name === 'Fred Bohanan' && attempt.member === 'Edna Ferber')
          ) {
            crewId = crewNameToId[attempt.member];
            if (!crewId) throw new Error('Something is off');
          }
        }
      }

      // stil no matches, log out
      if (!crewId) {
        misses.push(
          `MISS: ${guess.ceremonyYear} ${guess.movieTitle} ${guess.movieId} "${name}" from "${guess.full}"`
        );
        // matches that need double checking
      } else if (name !== crewIdToName[crewId]) {
        hitsForReview.push(`HIT: ${name} matched to ${crewIdToName[crewId]} - ${guess.movieId}`);
      }

      return { crew_id: crewId, oscar_id: guess.nomId };
    });
  });

  const readyToInsert = stuff.flat().filter(n => n.crew_id);
  const skipping = stuff.flat().filter(n => !n.crew_id);
  if (!realRun) uniq(hitsForReview).forEach(s => console.log(s));
  misses.forEach(s => console.log(s));
  console.log(`Found ${readyToInsert.length}, skipping ${skipping.length}`);

  if (realRun) {
    for (let i = 0; i < readyToInsert.length; i++) {
      try {
        await prisma.crew_on_oscars.create({
          data: readyToInsert[i],
        });
      } catch (e) {
        console.error('Failed', readyToInsert[i]);
        console.log(e);
      }
    }
  }
};

run(true);
