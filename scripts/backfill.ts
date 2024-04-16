import dotenvFlow from 'dotenv-flow';
import { writeFileSync } from 'fs';
import { kyselyDb } from '../pg/db';
import { tmdbApi } from './tmbd-api';

dotenvFlow.config();

const movieJson: {
  tmdb_id: number;
  vote_average: number;
  vote_count: number;
  popularity: number;
  language: string;
}[] = [];

const movieLangsJson: { tmdb_id: number; language: string }[] = [];
const movieCountryJson: { tmdb_id: number; country: string }[] = [];
const actorJson: Record<number, number> = {};
const crewJson: Record<number, number> = {};

const fetchMovie = async (tmdb_id: number) => {
  const response = await tmdbApi.getMovieById({ tmdbId: tmdb_id });
  console.log(response.title);

  movieJson.push({
    tmdb_id,
    vote_average: response.vote_average,
    vote_count: response.vote_count,
    popularity: response.popularity,
    language: response.original_language,
  });

  response.spoken_languages.forEach(l => {
    movieLangsJson.push({ language: l.iso_639_1, tmdb_id });
  });

  response.production_countries.forEach(pc => {
    movieCountryJson.push({ country: pc.iso_3166_1, tmdb_id });
  });

  response.credits.cast.map(c => {
    actorJson[c.id] = c.popularity;
  });

  response.credits.crew.map(c => {
    crewJson[c.id] = c.popularity;
  });
};

const run = async () => {
  const movies = await kyselyDb.selectFrom('movies').select('tmdb_id').orderBy('id desc').execute();

  for (let movie of movies) {
    try {
      await fetchMovie(movie.tmdb_id);
    } catch (e) {
      console.log('failed', movie.tmdb_id, e);
    }
  }

  writeFileSync('./pg/json/movies-additional.json', JSON.stringify(movieJson));
  writeFileSync(
    './pg/json/movies-lang-and-coun.json',
    JSON.stringify({ countries: movieCountryJson, languages: movieLangsJson })
  );
  writeFileSync('./pg/json/actors-popularity.json', JSON.stringify(actorJson));
  writeFileSync('./pg/json/crew-popularity.json', JSON.stringify(crewJson));
};

run().then(() => kyselyDb.destroy());
