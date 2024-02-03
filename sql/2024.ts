import { Prisma } from '../src/prisma';
import { titleCase } from '../src/utils/format';
import { connectToDb } from './general';
import { insertNewMovie } from './insert';
import { getMovieByTmdbId } from './select';
import { tmdbApi } from './tmdb-api';

const noms = [
  { award: 'ACTOR IN A LEADING ROLE', recipient: 'BRADLEY COOPER', movie: 'Maestro' },
  { award: 'ACTOR IN A LEADING ROLE', recipient: 'COLMAN DOMINGO', movie: 'Rustin' },
  { award: 'ACTOR IN A LEADING ROLE', recipient: 'PAUL GIAMATTI', movie: 'The Holdovers' },
  { award: 'ACTOR IN A LEADING ROLE', recipient: 'CILLIAN MURPHY', movie: 'Oppenheimer' },
  { award: 'ACTOR IN A LEADING ROLE', recipient: 'JEFFREY WRIGHT', movie: 'American Fiction' },
  {
    award: 'ACTOR IN A SUPPORTING ROLE',
    recipient: 'STERLING K. BROWN',
    movie: 'American Fiction',
  },
  {
    award: 'ACTOR IN A SUPPORTING ROLE',
    recipient: 'ROBERT DE NIRO',
    movie: 'Killers of the Flower Moon',
  },
  { award: 'ACTOR IN A SUPPORTING ROLE', recipient: 'ROBERT DOWNEY JR.', movie: 'Oppenheimer' },
  { award: 'ACTOR IN A SUPPORTING ROLE', recipient: 'RYAN GOSLING', movie: 'Barbie' },
  { award: 'ACTOR IN A SUPPORTING ROLE', recipient: 'MARK RUFFALO', movie: 'Poor Things' },
  { award: 'ACTRESS IN A LEADING ROLE', recipient: 'ANNETTE BENING', movie: 'Nyad' },
  {
    award: 'ACTRESS IN A LEADING ROLE',
    recipient: 'LILY GLADSTONE',
    movie: 'Killers of the Flower Moon',
  },
  { award: 'ACTRESS IN A LEADING ROLE', recipient: 'SANDRA HÜLLER', movie: 'Anatomy of a Fall' },
  { award: 'ACTRESS IN A LEADING ROLE', recipient: 'CAREY MULLIGAN', movie: 'Maestro' },
  { award: 'ACTRESS IN A LEADING ROLE', recipient: 'EMMA STONE', movie: 'Poor Things' },
  { award: 'ACTRESS IN A SUPPORTING ROLE', recipient: 'EMILY BLUNT', movie: 'Oppenheimer' },
  {
    award: 'ACTRESS IN A SUPPORTING ROLE',
    recipient: 'DANIELLE BROOKS',
    movie: 'The Color Purple',
  },
  { award: 'ACTRESS IN A SUPPORTING ROLE', recipient: 'AMERICA FERRERA', movie: 'Barbie' },
  { award: 'ACTRESS IN A SUPPORTING ROLE', recipient: 'JODIE FOSTER', movie: 'Nyad' },
  {
    award: 'ACTRESS IN A SUPPORTING ROLE',
    recipient: "DA'VINE JOY RANDOLPH",
    movie: 'The Holdovers',
  },
  {
    award: 'ANIMATED FEATURE FILM',
    movie: 'THE BOY AND THE HERON',
    recipient: 'Hayao Miyazaki and Toshio Suzuki',
  },
  { award: 'ANIMATED FEATURE FILM', movie: 'ELEMENTAL', recipient: 'Peter Sohn and Denise Ream' },
  {
    award: 'ANIMATED FEATURE FILM',
    movie: 'NIMONA',
    recipient: 'Nick Bruno, Troy Quane, Karen Ryan and Julie Zackary',
  },
  {
    award: 'ANIMATED FEATURE FILM',
    movie: 'ROBOT DREAMS',
    recipient: 'Pablo Berger, Ibon Cormenzana, Ignasi Estapé and Sandra Tapia Díaz',
  },
  {
    award: 'ANIMATED FEATURE FILM',
    movie: 'SPIDER-MAN: ACROSS THE SPIDER-VERSE',
    recipient: 'Kemp Powers, Justin K. Thompson, Phil Lord, Christopher Miller and Amy Pascal',
  },
  { award: 'CINEMATOGRAPHY', movie: 'EL CONDE', recipient: 'Edward Lachman' },
  { award: 'CINEMATOGRAPHY', movie: 'KILLERS OF THE FLOWER MOON', recipient: 'Rodrigo Prieto' },
  { award: 'CINEMATOGRAPHY', movie: 'MAESTRO', recipient: 'Matthew Libatique' },
  { award: 'CINEMATOGRAPHY', movie: 'OPPENHEIMER', recipient: 'Hoyte van Hoytema' },
  { award: 'CINEMATOGRAPHY', movie: 'POOR THINGS', recipient: 'Robbie Ryan' },
  { award: 'COSTUME DESIGN', movie: 'BARBIE', recipient: 'Jacqueline Durran' },
  { award: 'COSTUME DESIGN', movie: 'KILLERS OF THE FLOWER MOON', recipient: 'Jacqueline West' },
  { award: 'COSTUME DESIGN', movie: 'NAPOLEON', recipient: 'Janty Yates and Dave Crossman' },
  { award: 'COSTUME DESIGN', movie: 'OPPENHEIMER', recipient: 'Ellen Mirojnick' },
  { award: 'COSTUME DESIGN', movie: 'POOR THINGS', recipient: 'Holly Waddington' },

  { award: 'DIRECTING', movie: 'ANATOMY OF A FALL', recipient: 'Justine Triet' },
  { award: 'DIRECTING', movie: 'KILLERS OF THE FLOWER MOON', recipient: 'Martin Scorsese' },
  { award: 'DIRECTING', movie: 'OPPENHEIMER', recipient: 'Christopher Nolan' },
  { award: 'DIRECTING', movie: 'POOR THINGS', recipient: 'Yorgos Lanthimos' },
  { award: 'DIRECTING', movie: 'THE ZONE OF INTEREST', recipient: 'Jonathan Glazer' },
  {
    award: 'DOCUMENTARY FEATURE FILM',
    movie: "BOBI WINE: THE PEOPLE'S PRESIDENT",
    recipient: 'Moses Bwayo, Christopher Sharp and John Battsek',
  },
  { award: 'DOCUMENTARY FEATURE FILM', movie: 'THE ETERNAL MEMORY', recipient: 'None' },
  {
    award: 'DOCUMENTARY FEATURE FILM',
    movie: 'FOUR DAUGHTERS',
    recipient: 'Kaouther Ben Hania and Nadim Cheikhrouha',
  },
  {
    award: 'DOCUMENTARY FEATURE FILM',
    movie: 'TO KILL A TIGER',
    recipient: 'Nisha Pahuja, Cornelia Principe and David Oppenheim',
  },
  {
    award: 'DOCUMENTARY FEATURE FILM',
    movie: '20 DAYS IN MARIUPOL',
    recipient: 'Mstyslav Chernov, Michelle Mizner and Raney Aronson-Rath',
  },
  {
    award: 'DOCUMENTARY SHORT FILM',
    movie: 'THE ABCS OF BOOK BANNING',
    recipient: 'Sheila Nevins and Trish Adlesic',
  },
  {
    award: 'DOCUMENTARY SHORT FILM',
    movie: 'THE BARBER OF LITTLE ROCK',
    recipient: 'John Hoffman and Christine Turner',
  },
  {
    award: 'DOCUMENTARY SHORT FILM',
    movie: 'ISLAND IN BETWEEN',
    recipient: 'S. Leo Chiang and Jean Tsien',
  },
  {
    award: 'DOCUMENTARY SHORT FILM',
    movie: 'THE LAST REPAIR SHOP',
    recipient: 'Ben Proudfoot and Kris Bowers',
  },
  {
    award: 'DOCUMENTARY SHORT FILM',
    movie: 'NǍI NAI & WÀI PÓ',
    recipient: 'Sean Wang and Sam Davis',
  },
  { award: 'FILM EDITING', movie: 'ANATOMY OF A FALL', recipient: 'Laurent Sénéchal' },
  { award: 'FILM EDITING', movie: 'THE HOLDOVERS', recipient: 'Kevin Tent' },
  { award: 'FILM EDITING', movie: 'KILLERS OF THE FLOWER MOON', recipient: 'Thelma Schoonmaker' },
  { award: 'FILM EDITING', movie: 'OPPENHEIMER', recipient: 'Jennifer Lame' },
  { award: 'FILM EDITING', movie: 'POOR THINGS', recipient: 'Yorgos Mavropsaridis' },
  { award: 'INTERNATIONAL FEATURE FILM', movie: 'IO CAPITANO', recipient: 'Italy' },
  { award: 'INTERNATIONAL FEATURE FILM', movie: 'PERFECT DAYS', recipient: 'Japan' },
  { award: 'INTERNATIONAL FEATURE FILM', movie: 'SOCIETY OF THE SNOW', recipient: 'Spain' },
  { award: 'INTERNATIONAL FEATURE FILM', movie: "THE TEACHERS' LOUNGE", recipient: 'Germany' },
  {
    award: 'INTERNATIONAL FEATURE FILM',
    movie: 'THE ZONE OF INTEREST',
    recipient: 'United Kingdom',
  },
  {
    award: 'MAKEUP AND HAIRSTYLING',
    movie: 'GOLDA',
    recipient: 'Karen Hartley Thomas, Suzi Battersby and Ashra Kelly-Blue',
  },
  {
    award: 'MAKEUP AND HAIRSTYLING',
    movie: 'MAESTRO',
    recipient: 'Kazu Hiro, Kay Georgiou and Lori McCoy-Bell',
  },
  { award: 'MAKEUP AND HAIRSTYLING', movie: 'OPPENHEIMER', recipient: 'Luisa Abel' },
  {
    award: 'MAKEUP AND HAIRSTYLING',
    movie: 'POOR THINGS',
    recipient: 'Nadia Stacey, Mark Coulier and Josh Weston',
  },
  {
    award: 'MAKEUP AND HAIRSTYLING',
    movie: 'SOCIETY OF THE SNOW',
    recipient: 'Ana López-Puigcerver, David Martí and Montse Ribé',
  },
  { award: 'MUSIC (Original Score)', movie: 'AMERICAN FICTION', recipient: 'Laura Karpman' },
  {
    award: 'MUSIC (Original Score)',
    movie: 'INDIANA JONES AND THE DIAL OF DESTINY',
    recipient: 'John Williams',
  },
  {
    award: 'MUSIC (Original Score)',
    movie: 'KILLERS OF THE FLOWER MOON',
    recipient: 'Robbie Robertson',
  },
  { award: 'MUSIC (Original Score)', movie: 'OPPENHEIMER', recipient: 'Ludwig Göransson' },
  { award: 'MUSIC (Original Score)', movie: 'POOR THINGS', recipient: 'Jerskin Fendrix' },

  {
    award: 'MUSIC (Original Song)',
    movie: "FLAMIN' HOT",
    recipient: 'THE FIRE INSIDE; Music and Lyric by Diane Warren',
  },
  {
    award: 'MUSIC (Original Song)',
    movie: 'BARBIE',
    recipient: "I'M JUST KEN; Music and Lyric by Mark Ronson and Andrew Wyatt",
  },
  {
    award: 'MUSIC (Original Song)',
    movie: 'AMERICAN SYMPHONY',
    recipient: 'IT NEVER WENT AWAY; Music and Lyric by Jon Batiste and Dan Wilson',
  },
  {
    award: 'MUSIC (Original Song)',
    movie: 'KILLERS OF THE FLOWER MOON',
    recipient: 'WAHZHAZHE (A SONG FOR MY PEOPLE); Music and Lyric by Scott George',
  },
  {
    award: 'MUSIC (Original Song)',
    movie: 'BARBIE',
    recipient: "WHAT WAS I MADE FOR?; Music and Lyric by Billie Eilish and Finneas O'Connell",
  },
  {
    award: 'BEST PICTURE',
    movie: 'AMERICAN FICTION',
    recipient: 'Ben LeClair, Nikos Karamigios, Cord Jefferson and Jermaine Johnson, Producers',
  },
  {
    award: 'BEST PICTURE',
    movie: 'ANATOMY OF A FALL',
    recipient: 'Marie-Ange Luciani and David Thion, Producers',
  },
  {
    award: 'BEST PICTURE',
    movie: 'BARBIE',
    recipient: 'David Heyman, Margot Robbie, Tom Ackerley and Robbie Brenner, Producers',
  },
  { award: 'BEST PICTURE', movie: 'THE HOLDOVERS', recipient: 'Mark Johnson, Producer' },
  {
    award: 'BEST PICTURE',
    movie: 'KILLERS OF THE FLOWER MOON',
    recipient: 'Dan Friedkin, Bradley Thomas, Martin Scorsese and Daniel Lupi, Producers',
  },
  {
    award: 'BEST PICTURE',
    movie: 'MAESTRO',
    recipient:
      'Bradley Cooper, Steven Spielberg, Fred Berner, Amy Durning and Kristie Macosko Krieger, Producers',
  },
  {
    award: 'BEST PICTURE',
    movie: 'OPPENHEIMER',
    recipient: 'Emma Thomas, Charles Roven and Christopher Nolan, Producers',
  },
  {
    award: 'BEST PICTURE',
    movie: 'PAST LIVES',
    recipient: 'David Hinojosa, Christine Vachon and Pamela Koffler, Producers',
  },
  {
    award: 'BEST PICTURE',
    movie: 'POOR THINGS',
    recipient: 'Ed Guiney, Andrew Lowe, Yorgos Lanthimos and Emma Stone, Producers',
  },
  { award: 'BEST PICTURE', movie: 'THE ZONE OF INTEREST', recipient: 'James Wilson, Producer' },
  {
    award: 'PRODUCTION DESIGN',
    movie: 'BARBIE',
    recipient: 'Production Design: Sarah Greenwood; Set Decoration: Katie Spencer',
  },
  {
    award: 'PRODUCTION DESIGN',
    movie: 'KILLERS OF THE FLOWER MOON',
    recipient: 'Production Design: Jack Fisk; Set Decoration: Adam Willis',
  },
  {
    award: 'PRODUCTION DESIGN',
    movie: 'NAPOLEON',
    recipient: 'Production Design: Arthur Max; Set Decoration: Elli Griff',
  },
  {
    award: 'PRODUCTION DESIGN',
    movie: 'OPPENHEIMER',
    recipient: 'Production Design: Ruth De Jong; Set Decoration: Claire Kaufman',
  },
  {
    award: 'PRODUCTION DESIGN',
    movie: 'POOR THINGS',
    recipient: 'Production Design: James Price and Shona Heath; Set Decoration: Zsuzsa Mihalek',
  },
  {
    award: 'SHORT FILM (Animated)',
    movie: 'LETTER TO A PIG',
    recipient: 'Tal Kantor and Amit R. Gicelter',
  },
  {
    award: 'SHORT FILM (Animated)',
    movie: 'NINETY-FIVE SENSES',
    recipient: 'Jerusha Hess and Jared Hess',
  },
  { award: 'SHORT FILM (Animated)', movie: 'OUR UNIFORM', recipient: 'Yegane Moghaddam' },
  {
    award: 'SHORT FILM (Animated)',
    movie: 'PACHYDERME',
    recipient: 'Stéphanie Clément and Marc Rius',
  },
  {
    award: 'SHORT FILM (Animated)',
    movie: 'WAR IS OVER! INSPIRED BY THE MUSIC OF JOHN & YOKO',
    recipient: 'Dave Mullins and Brad Booker',
  },
  {
    award: 'SHORT FILM (Live Action)',
    movie: 'THE AFTER',
    recipient: 'Misan Harriman and Nicky Bentham',
  },
  {
    award: 'SHORT FILM (Live Action)',
    movie: 'INVINCIBLE',
    recipient: 'Vincent René-Lortie and Samuel Caron',
  },
  {
    award: 'SHORT FILM (Live Action)',
    movie: 'KNIGHT OF FORTUNE',
    recipient: 'Lasse Lyskjær Noer and Christian Norlyk',
  },
  {
    award: 'SHORT FILM (Live Action)',
    movie: 'RED, WHITE AND BLUE',
    recipient: 'Nazrin Choudhury and Sara McFarlane',
  },
  {
    award: 'SHORT FILM (Live Action)',
    movie: 'THE WONDERFUL STORY OF HENRY SUGAR',
    recipient: 'Wes Anderson and Steven Rales',
  },
  {
    award: 'SOUND',
    movie: 'THE CREATOR',
    recipient: 'Ian Voigt, Erik Aadahl, Ethan Van der Ryn, Tom Ozanich and Dean Zupancic',
  },
  {
    award: 'SOUND',
    movie: 'MAESTRO',
    recipient: 'Steven A. Morrow, Richard King, Jason Ruder, Tom Ozanich and Dean Zupancic',
  },
  {
    award: 'SOUND',
    movie: 'MISSION: IMPOSSIBLE - DEAD RECKONING PART ONE',
    recipient: 'Chris Munro, James H. Mather, Chris Burdon and Mark Taylor',
  },
  {
    award: 'SOUND',
    movie: 'OPPENHEIMER',
    recipient: "Willie Burton, Richard King, Gary A. Rizzo and Kevin O'Connell",
  },
  { award: 'SOUND', movie: 'THE ZONE OF INTEREST', recipient: 'Tarn Willers and Johnnie Burn' },
  {
    award: 'VISUAL EFFECTS',
    movie: 'THE CREATOR',
    recipient: 'Jay Cooper, Ian Comley, Andrew Roberts and Neil Corbould',
  },
  {
    award: 'VISUAL EFFECTS',
    movie: 'GODZILLA MINUS ONE',
    recipient: 'Takashi Yamazaki, Kiyoko Shibuya, Masaki Takahashi and Tatsuji Nojima',
  },
  {
    award: 'VISUAL EFFECTS',
    movie: 'GUARDIANS OF THE GALAXY VOL. 3',
    recipient: 'Stephane Ceretti, Alexis Wajsbrot, Guy Williams and Theo Bialek',
  },
  {
    award: 'VISUAL EFFECTS',
    movie: 'MISSION: IMPOSSIBLE - DEAD RECKONING PART ONE',
    recipient: 'Alex Wuttke, Simone Coco, Jeff Sutherland and Neil Corbould',
  },
  {
    award: 'VISUAL EFFECTS',
    movie: 'NAPOLEON',
    recipient: 'Charley Henley, Luc-Ewen Martin-Fenouillet, Simone Coco and Neil Corbould',
  },
  {
    award: 'WRITING (Adapted Screenplay)',
    movie: 'AMERICAN FICTION',
    recipient: 'Written for the screen by Cord Jefferson',
  },
  {
    award: 'WRITING (Adapted Screenplay)',
    movie: 'BARBIE',
    recipient: 'Written by Greta Gerwig & Noah Baumbach',
  },
  {
    award: 'WRITING (Adapted Screenplay)',
    movie: 'OPPENHEIMER',
    recipient: 'Written for the screen by Christopher Nolan',
  },
  {
    award: 'WRITING (Adapted Screenplay)',
    movie: 'POOR THINGS',
    recipient: 'Screenplay by Tony McNamara',
  },
  {
    award: 'WRITING (Adapted Screenplay)',
    movie: 'THE ZONE OF INTEREST',
    recipient: 'Written by Jonathan Glazer',
  },
  {
    award: 'WRITING (Original Screenplay)',
    movie: 'ANATOMY OF A FALL',
    recipient: 'Screenplay - Justine Triet and Arthur Harari',
  },
  {
    award: 'WRITING (Original Screenplay)',
    movie: 'THE HOLDOVERS',
    recipient: 'Written by David Hemingson',
  },
  {
    award: 'WRITING (Original Screenplay)',
    movie: 'MAESTRO',
    recipient: 'Written by Bradley Cooper & Josh Singer',
  },
  {
    award: 'WRITING (Original Screenplay)',
    movie: 'MAY DECEMBER',
    recipient: 'Screenplay by Samy Burch; Story by Samy Burch & Alex Mechanik',
  },
  {
    award: 'WRITING (Original Screenplay)',
    movie: 'PAST LIVES',
    recipient: 'Written by Celine Song',
  },
];

const movies: Record<string, number> = {
  maestro: 523607,
  rustin: 898713,
  'the holdovers': 840430,
  oppenheimer: 872585,
  'american fiction': 1056360,
  'killers of the flower moon': 466420,
  barbie: 346698,
  'poor things': 792307,
  nyad: 895549,
  'anatomy of a fall': 915935,
  'the color purple': 558915,
  'the boy and the heron': 508883,
  elemental: 976573,
  nimona: 961323,
  'robot dreams': 838240,
  'spider-man: across the spider-verse': 569094,
  'el conde': 991708,
  napoleon: 753342,
  'the zone of interest': 467244,
  "bobi wine: the people's president": 1004683,
  'the eternal memory': 1032760,
  'four daughters': 1069193,
  'to kill a tiger': 1015356,
  '20 days in mariupol': 1058616,
  'the abcs of book banning': 1186227,
  'the barber of little rock': 1186247,
  'island in between': 1203439,
  'the last repair shop': 1171861,
  'nǎi nai & wài pó': 1085779,
  'io capitano': 937746,
  'perfect days': 976893,
  'society of the snow': 906126,
  "the teachers' lounge": 998022,
  golda: 899524,
  'indiana jones and the dial of destiny': 335977,
  "flamin' hot": 626332,
  'american symphony': 1171816,
  'past lives': 666277,
  'letter to a pig': 950810,
  'ninety-five senses': 1040371,
  'our uniform': 1140605,
  pachyderme: 950822,
  'war is over! inspired by the music of john & yoko': 1214020,
  'the after': 1169455,
  invincible: 1084765,
  'knight of fortune': 971468,
  'red, white and blue': 1194636,
  'the wonderful story of henry sugar': 923939,
  'the creator': 670292,
  'mission: impossible - dead reckoning part one': 575264,
  'godzilla minus one': 940721,
  'guardians of the galaxy vol. 3': 447365,
  'may december': 839369,
};

// lookup ids via prisma studio
const actors: Record<string, number> = {
  'BRADLEY COOPER': 3273,
  'COLMAN DOMINGO': 109053,
  'PAUL GIAMATTI': 611,
  'CILLIAN MURPHY': 9431,
  'JEFFREY WRIGHT': 15203,
  'STERLING K. BROWN': 120184,
  'ROBERT DE NIRO': 88,
  'ROBERT DOWNEY JR.': 13590,
  'RYAN GOSLING': 9968,
  'MARK RUFFALO': 6714,
  'ANNETTE BENING': 6558,
  'LILY GLADSTONE': 173767,
  'SANDRA HÜLLER': 117738,
  'CAREY MULLIGAN': 96446,
  'EMMA STONE': 4346,
  'EMILY BLUNT': 8812,
  'DANIELLE BROOKS': 174284,
  'AMERICA FERRERA': 106030,
  'JODIE FOSTER': 2799,
  "DA'VINE JOY RANDOLPH": 17435,
};

const directors: Record<string, number> = {
  'Justine Triet': 195463,
  'Martin Scorsese': 57,
  'Christopher Nolan': 7690,
  'Yorgos Lanthimos': 161227,
  'Jonathan Glazer': 125813,
};

const movieIds = Object.values(movies);
const db = connectToDb();
const prisma = Prisma.getPrisma();

const fetchAndStoreMovie = async (i: number) => {
  const tmdb_id = movieIds[i];
  if (!tmdb_id) return;
  const parsedMovie = await tmdbApi.getMovieById({ tmdb_id }).then(tmdbApi.parseMovieById);
  await insertNewMovie(db, parsedMovie);
  console.log('Added', parsedMovie.movie.title);
  fetchAndStoreMovie(i + 1);
};

// fetchAndStoreMovie(0);
let oscarMovies: {
  id: number;
  tmdb_id: number;
  actors_on_movies: { actors: { id: number; name: string } }[];
}[];
let awards: { id: number; name: string; category_id: number }[];
const addNomination = async (i: number) => {
  const nom = noms[i];
  if (!nom) return;
  if (!oscarMovies) {
    oscarMovies = await prisma.movies.findMany({
      select: {
        id: true,
        tmdb_id: true,
        actors_on_movies: {
          include: { actors: true },
        },
      },
      where: { tmdb_id: { in: movieIds } },
    });
  }
  if (!awards) {
    awards = await prisma.oscars_awards.findMany();
  }

  const award = awards.find(a => a.name === nom.award);
  if (!award) throw new Error(`Can't find award ${nom.award}`);
  const tmdbId = movies[nom.movie];
  const movie = await getMovieByTmdbId(tmdbId);
  if (!movie) throw new Error(`Cant find movie ${nom.movie}`);

  const isActor = [1, 2, 19, 20].includes(award.category_id);
  const isDirector = [8].includes(award.category_id);

  const record = await prisma.oscars_nominations.create({
    data: {
      ceremony_year: 2024,
      film_year: 2023,
      recipient: isActor ? titleCase(nom.recipient) : nom.recipient,
      won: false,
      movie_id: movie.id,
      award_id: award.id,
    },
  });

  if (isActor) {
    await prisma.actors_on_oscars.create({
      data: { actor_id: actors[nom.recipient], oscar_id: record.id },
    });
  }
  if (isDirector) {
    await prisma.crew_on_oscars.create({
      data: { crew_id: directors[nom.recipient], oscar_id: record.id },
    });
  }

  addNomination(i + 1);
};

addNomination(0);
