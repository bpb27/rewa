import dotenvFlow from 'dotenv-flow';
import { writeFileSync } from 'fs';

dotenvFlow.config();
const API_KEY = process.env.TMDB_API_KEY;

const test = async () => {
  const languages = await fetch(
    `https://api.themoviedb.org/3/configuration/languages?api_key=${API_KEY}`
  ).then(r => r.json());
  const countries = await fetch(
    `https://api.themoviedb.org/3/configuration/countries?api_key=${API_KEY}`
  ).then(r => r.json());

  writeFileSync('./countries_and_languages.json', JSON.stringify({ countries, languages }));
};

test();
