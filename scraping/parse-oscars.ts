import fs from 'fs';
import Database from 'better-sqlite3';
import { addMovieToDb } from '../sql/new-movie';
import { uniqBy } from 'remeda';

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
  award_category: AwardCategory;
  award_name: AwardName;
  ceremony_year: number;
  film_name: string;
  film_year: number;
  person_name: string;
  won: boolean;
};

type AwardCategory = (typeof awardMap)[number]['category'];
type AwardName = (typeof awardMap)[number]['name'];

// prettier-ignore
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
  { name: 'MUSIC (Original Song Score and Its Adaptation -or- Adaptation Score)', category: 'music' },
  { name: 'MUSIC (Original Song Score and Its Adaptation or Adaptation Score)', category: 'music' },
  { name: 'MUSIC (Original Song Score or Adaptation Score)', category: 'music' },
  { name: 'MUSIC (Original Song Score)', category: 'song' },
  { name: 'MUSIC (Original Song)', category: 'song' },
  { name: 'MUSIC (Score of a Musical Picture--original or adaptation)', category: 'music' },
  { name: 'MUSIC (Scoring of Music--adaptation or treatment)', category: 'music' },
  { name: 'MUSIC (Scoring of a Musical Picture)', category: 'music' },
  { name: 'MUSIC (Scoring)', category: 'music' },
  { name: 'MUSIC (Scoring: Adaptation and Original Song Score)', category: 'song' },
  { name: 'MUSIC (Scoring: Original Song Score and Adaptation -or- Scoring: Adaptation)', category: 'song' },
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
  { name: 'WRITING (Screenplay Based on Material Previously Produced or Published)', category: 'writing_adapted' },
  { name: 'WRITING (Screenplay Based on Material from Another Medium)', category: 'writing_adapted' },
  { name: 'WRITING (Screenplay Written Directly for the Screen)', category: 'writing' },
  { name: 'WRITING (Screenplay Written Directly for the Screen--based on factual material or on story material not previously published or produced)', category: 'writing' },
  { name: 'WRITING (Screenplay)', category: 'writing' },
  { name: 'WRITING (Screenplay--Adapted)', category: 'writing_adapted' },
  { name: 'WRITING (Screenplay--Original)', category: 'writing' },
  { name: 'WRITING (Screenplay--based on material from another medium)', category: 'writing_adapted' },
  { name: 'WRITING (Story and Screenplay)', category: 'writing' },
  { name: 'WRITING (Story and Screenplay--based on factual material or material not previously published or produced)', category: 'writing' },
  { name: 'WRITING (Story and Screenplay--based on material not previously published or produced)', category: 'writing' },
  { name: 'WRITING (Story and Screenplay--written directly for the screen)', category: 'writing' },
] as const;

const getCategoryTag = (name: string) => awardMap.find(a => a.name === name)?.category;

function csvParser() {
  const data = fs.readFileSync('./scraping/the_oscar_award.csv', 'utf-8');
  const lines = data.split('\n').slice(1);
  const results = [];

  for (const line of lines) {
    if (line) {
      // Check for empty lines
      const values = [];
      let inQuotes = false;
      let valueBuffer = '';

      for (let char of line) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(valueBuffer.trim());
          valueBuffer = '';
        } else {
          valueBuffer += char;
        }
      }
      values.push(valueBuffer.trim());
      results.push(values);
    }
  }

  console.log(results);
  return results;
}

export async function parseOscarCsv(): Promise<ParsedOscar[]> {
  try {
    const lines = csvParser();
    return (
      lines
        .map((line: string[]): ParsedOscar => {
          const [
            year_film,
            year_ceremony,
            _ceremony_number,
            award_name,
            person_name,
            film_name,
            winner,
            // some name fields are double-quoted comma-separated strings, so replacing commas w/ "and"
          ] = line;
          return {
            award_category: getCategoryTag(award_name)!,
            award_name: award_name as AwardName,
            ceremony_year: Number(year_ceremony),
            film_name,
            film_year: Number(year_film),
            person_name: person_name,
            won: winner === 'True',
          };
        })
        // NB: filtering out honorary award stuff that isn't in the map
        .filter(
          ({ film_year, award_category }: ParsedOscar) => film_year >= 1950 && !!award_category
        )
    );
  } catch (err) {
    console.error('Error reading or parsing the CSV:', err);
    return [];
  }
}

const getMovie = async ({ film_name, film_year }: ParsedOscar) => {
  const apiKey = process.env.TMDB_API_KEY;
  const queryRoute = `https://api.themoviedb.org/3/search/movie?query=${encodeURI(
    film_name
  )}&include_adult=false&language=en-US&page=1&api_key=${apiKey}`;
  try {
    const queryResponse = await fetch(queryRoute);
    const queryJson = (await queryResponse.json()) as {
      results: { id: number; release_date: string }[];
      total_results: number;
    };
    if (!queryJson.total_results) throw new Error('Not found');
    const movie = queryJson.results.find(
      r =>
        r.release_date.startsWith(film_year.toString()) ||
        r.release_date.startsWith((film_year - 1).toString()) ||
        r.release_date.startsWith((film_year + 1).toString()) ||
        r.release_date.startsWith((film_year - 2).toString()) ||
        r.release_date.startsWith((film_year + 2).toString()) ||
        r.release_date.startsWith((film_year - 3).toString()) ||
        r.release_date.startsWith((film_year + 3).toString()) ||
        r.release_date.startsWith((film_year - 4).toString()) ||
        r.release_date.startsWith((film_year + 4).toString()) ||
        r.release_date.startsWith((film_year - 5).toString()) ||
        r.release_date.startsWith((film_year + 5).toString())
    );
    if (!movie) throw new Error('Not found for that year');
    const getRoute = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&append_to_response=credits`;
    const getResponse = await fetch(getRoute);
    const getJson = await getResponse.json();
    return getJson;
  } catch (e) {
    console.error(`Failed to fetch ${film_name} from ${film_year}`, e);
    return undefined;
  }
};

parseOscarCsv().then(async result => {
  const db = new Database('./prisma/db.sqlite', {
    readonly: false,
    timeout: 5000,
  });

  const data = uniqBy(
    result.filter(oscar => oscar.ceremony_year >= 1950),
    movie => movie.film_name + movie.film_year
  );

  const addMovie = async (i: number) => {
    const item = data[i];
    if (!item) return;
    try {
      const result = await getMovie(item);
      addMovieToDb(db, result);
      console.log('Added', item.film_name, item.film_year);
    } catch (e) {
      console.log('FAILED TO GET OR INSERT MOVIE', item.film_name, item.film_year, e);
    }
    setTimeout(() => addMovie(i + 1), 200);
  };

  addMovie(0);
  /*
    try w/ year 2000 first
    insert all movies
    create award name table
    create oscar table
    reiterate over parsed oscar list (not deduped), query for movie, actor, crew by name then insert oscar
    probably can't match award names to people - to many variables - will need to just do via movies when querying
  */
});
