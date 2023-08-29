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

// need to properly find/match films and actors
// probably add a normalized_category to awards
parseCsv().then(data => {
  const awards = Object.keys(
    data
      .filter((i: ParsedOscar) => i.yearFilm >= 1950 && i.film)
      .reduce((hash, i) => ({ ...hash, [i.category]: true }), {})
  );
  console.log(awards.length);
});
