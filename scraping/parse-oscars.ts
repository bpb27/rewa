const fs = require("fs").promises;

type Oscar = {
  year_film: string;
  year_ceremony: string;
  ceremony: string;
  category: string;
  name: string;
  film: string;
  winner: string; // Depending on your needs, this might be better as a boolean
};

async function parseCsv(): Promise<Oscar[]> {
  try {
    const data = await fs.readFile("./scraping/the_oscar_award.csv", "utf-8");
    const lines = data.split("\n").slice(1); // Split by lines and remove header
    return lines.map(line => {
      const [year_film, year_ceremony, ceremony, category, name, film, winner] = line.split(",");
      return {
        year_film: Number(year_film),
        year_ceremony: Number(year_ceremony),
        ceremony,
        category,
        name,
        film,
        winner: winner === "TRUE",
      };
    });
  } catch (err) {
    console.error("Error reading or parsing the CSV:", err);
    return [];
  }
}

// need to properly find/match films and actors
// probably add a normalized_category to awards
parseCsv().then(data => {
  const awards = Object.keys(
    data
      .filter(i => i.year_film >= 1950 && i.film)
      .reduce((hash, i) => ({ ...hash, [i.category]: true }), {})
  );
  console.log(awards.length);
});
