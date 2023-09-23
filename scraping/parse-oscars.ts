const fs = require('fs').promises;

type RawOscar = {
  year_film: string;
  year_ceremony: string;
  ceremony: string;
  category: string;
  name: string;
  film: string;
  winner: string;
};

type ParsedOscar = {
  yearFilm: number;
  yearCeremony: number;
  ceremony: string;
  category: string;
  name: string;
  film: string;
  won: boolean;
};

async function parseCsv(): Promise<ParsedOscar[]> {
  try {
    const data = await fs.readFile('./scraping/the_oscar_award.csv', 'utf-8');
    const lines = data.split('\n').slice(1); // Split by lines and remove header
    return lines.map((line: string) => {
      const [year_film, year_ceremony, ceremony, category, name, film, winner] = line.split(',');
      return {
        yearFilm: Number(year_film),
        yearCeremony: Number(year_ceremony),
        ceremony,
        category,
        name,
        film,
        won: winner === 'TRUE',
      };
    });
  } catch (err) {
    console.error('Error reading or parsing the CSV:', err);
    return [];
  }
}

const getMovie = async ({ film, yearFilm }: { film: string; yearFilm: number }) => {
  const apiKey = process.env.TMDB_API_KEY;
  const queryRoute = `https://api.themoviedb.org/3/search/movie?query=${encodeURI(
    film
  )}&include_adult=false&language=en-US&page=1&api_key=${apiKey}`;
  try {
    const queryResponse = await fetch(queryRoute);
    const queryJson = (await queryResponse.json()) as {
      results: { id: number; release_date: string }[];
      total_results: number;
    };
    if (!queryJson.total_results) throw new Error('Not found');
    const movie = queryJson.results.find(r => r.release_date.startsWith(yearFilm.toString()));
    if (!movie) throw new Error('Not found for that year');

    const getRoute = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&append_to_response=credits`;
    const getResponse = await fetch(getRoute);
    const getJson = await getResponse.json();
    return getJson;
  } catch (e) {
    console.error(`Failed to fetch ${film} from ${yearFilm}`, e);
    return undefined;
  }
};

parseCsv().then(async result => {
  const data = result
    .filter(oscar => oscar.yearFilm >= 1950 && getCategoryTag(oscar.category))
    .map(oscar => ({ ...oscar, categoryTag: getCategoryTag(oscar.category) }));

  const firstMovie = await getMovie(data[0]);
  // oscars
  // oscars_on_movies
  // change rewa query to go thru episode
  // add movies
  // oscar query through oscars_on_movies
  console.log(firstMovie);
});

const getCategoryTag = (name: string) => awardMap.find(a => a.name === name)?.category;

const awardMap = [
  { name: 'ACTOR', category: 'actor' },
  { name: 'ACTOR IN A LEADING ROLE', category: 'actor' },
  { name: 'ACTOR IN A SUPPORTING ROLE', category: 'supporting_actor' },
  { name: 'ACTRESS', category: 'actress' },
  { name: 'ACTRESS IN A LEADING ROLE', category: 'actress' },
  { name: 'ACTRESS IN A SUPPORTING ROLE', category: 'supporting_actress' },
  { name: 'ANIMATED FEATURE FILM', category: 'animated_film' },
  { name: 'ART DIRECTION', category: 'art_direction' },
  { name: 'ART DIRECTION (Black-and-White)', category: 'art_direction' },
  { name: 'ART DIRECTION (Color)', category: 'art_direction' },
  { name: 'BEST MOTION PICTURE', category: 'best_picture' },
  { name: 'BEST PICTURE', category: 'best_picture' },
  { name: 'CINEMATOGRAPHY', category: 'cinematography' },
  { name: 'CINEMATOGRAPHY (Black-and-White)', category: 'cinematography' },
  { name: 'CINEMATOGRAPHY (Color)', category: 'cinematography' },
  { name: 'COSTUME DESIGN', category: 'costume' },
  { name: 'COSTUME DESIGN (Black-and-White)', category: 'costume' },
  { name: 'COSTUME DESIGN (Color)', category: 'costume' },
  { name: 'DIRECTING', category: 'directing' },
  { name: 'DOCUMENTARY (Feature)', category: 'documentary' },
  { name: 'DOCUMENTARY (Short Subject)', category: 'documentary_short' },
  { name: 'DOCUMENTARY FEATURE FILM', category: 'documentary' },
  { name: 'DOCUMENTARY SHORT FILM', category: 'documentary_short' },
  { name: 'FILM EDITING', category: 'editing' },
  { name: 'FOREIGN LANGUAGE FILM', category: 'foreign_language' },
  { name: 'INTERNATIONAL FEATURE FILM', category: 'foreign_language' },
  { name: 'MAKEUP', category: 'makeup' },
  { name: 'MAKEUP AND HAIRSTYLING', category: 'makeup' },
  { name: 'MUSIC (Adaptation Score)', category: 'music' },
  { name: 'MUSIC (Music Score of a Dramatic or Comedy Picture)', category: 'music' },
  { name: 'MUSIC (Music Score--substantially original)', category: 'music' },
  { name: 'MUSIC (Original Dramatic Score)', category: 'music' },
  { name: 'MUSIC (Original Music Score)', category: 'music' },
  { name: 'MUSIC (Original Musical or Comedy Score)', category: 'music' },
  { name: 'MUSIC (Original Score)', category: 'music' },
  { name: 'MUSIC (Original Score--for a motion picture [not a musical])', category: 'music' },
  {
    name: 'MUSIC (Original Song Score and Its Adaptation -or- Adaptation Score)',
    category: 'music',
  },
  { name: 'MUSIC (Original Song Score and Its Adaptation or Adaptation Score)', category: 'music' },
  { name: 'MUSIC (Original Song Score or Adaptation Score)', category: 'music' },
  { name: 'MUSIC (Original Song Score)', category: 'song' },
  { name: 'MUSIC (Original Song)', category: 'song' },
  { name: 'MUSIC (Score of a Musical Picture--original or adaptation)', category: 'music' },
  { name: 'MUSIC (Scoring of Music--adaptation or treatment)', category: 'music' },
  { name: 'MUSIC (Scoring of a Musical Picture)', category: 'music' },
  { name: 'MUSIC (Scoring)', category: 'music' },
  { name: 'MUSIC (Scoring: Adaptation and Original Song Score)', category: 'song' },
  {
    name: 'MUSIC (Scoring: Original Song Score and Adaptation -or- Scoring: Adaptation)',
    category: 'song',
  },
  { name: 'MUSIC (Song)', category: 'song' },
  { name: 'MUSIC (Song--Original for the Picture)', category: 'song' },
  { name: 'PRODUCTION DESIGN', category: 'production_design' },
  { name: 'SHORT FILM (Animated)', category: 'short' },
  { name: 'SHORT FILM (Dramatic Live Action)', category: 'short' },
  { name: 'SHORT FILM (Live Action)', category: 'short' },
  { name: 'SHORT SUBJECT (Animated)', category: 'short' },
  { name: 'SHORT SUBJECT (Cartoon)', category: 'short' },
  { name: 'SHORT SUBJECT (Live Action)', category: 'short' },
  { name: 'SHORT SUBJECT (One-reel)', category: 'short' },
  { name: 'SHORT SUBJECT (Two-reel)', category: 'short' },
  { name: 'SOUND', category: 'sound' },
  { name: 'SOUND EDITING', category: 'sound' },
  { name: 'SOUND EFFECTS', category: 'sound' },
  { name: 'SOUND EFFECTS EDITING', category: 'sound' },
  { name: 'SOUND MIXING', category: 'sound' },
  { name: 'SOUND RECORDING', category: 'sound' },
  { name: 'SPECIAL ACHIEVEMENT AWARD (Sound Editing)', category: 'sound' },
  { name: 'SPECIAL ACHIEVEMENT AWARD (Sound Effects Editing)', category: 'sound' },
  { name: 'SPECIAL ACHIEVEMENT AWARD (Sound Effects)', category: 'sound' },
  { name: 'SPECIAL ACHIEVEMENT AWARD (Visual Effects)', category: 'visual_effects' },
  { name: 'SPECIAL EFFECTS', category: 'visual_effects' },
  { name: 'SPECIAL VISUAL EFFECTS', category: 'visual_effects' },
  { name: 'VISUAL EFFECTS', category: 'visual_effects' },
  { name: 'WRITING (Adapted Screenplay)', category: 'writing_adapted' },
  { name: 'WRITING (Motion Picture Story)', category: 'wrting' },
  { name: 'WRITING (Original Screenplay)', category: 'wrting' },
  { name: 'WRITING (Screenplay Adapted from Other Material)', category: 'writing_adapted' },
  {
    name: 'WRITING (Screenplay Based on Material Previously Produced or Published)',
    category: 'writing_adapted',
  },
  {
    name: 'WRITING (Screenplay Based on Material from Another Medium)',
    category: 'writing_adapted',
  },
  { name: 'WRITING (Screenplay Written Directly for the Screen)', category: 'writing' },
  {
    name: 'WRITING (Screenplay Written Directly for the Screen--based on factual material or on story material not previously published or produced)',
    category: 'writing',
  },
  { name: 'WRITING (Screenplay)', category: 'writing' },
  { name: 'WRITING (Screenplay--Adapted)', category: 'writing_adapted' },
  { name: 'WRITING (Screenplay--Original)', category: 'writing' },
  {
    name: 'WRITING (Screenplay--based on material from another medium)',
    category: 'writing_adapted',
  },
  { name: 'WRITING (Story and Screenplay)', category: 'writing' },
  {
    name: 'WRITING (Story and Screenplay--based on factual material or material not previously published or produced)',
    category: 'writing',
  },
  {
    name: 'WRITING (Story and Screenplay--based on material not previously published or produced)',
    category: 'writing',
  },
  { name: 'WRITING (Story and Screenplay--written directly for the screen)', category: 'writing' },
] as const;

type AwardCategory = (typeof awardMap)[number]['category'];
type AwardName = (typeof awardMap)[number]['name'];
