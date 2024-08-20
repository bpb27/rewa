import { Kysely } from 'kysely';
import { z } from 'zod';
import { DB } from '../pg/generated';
import { tmdbApi } from './tmbd-api';

/*
  NB:
  - be careful changing this script
    - it's used in migrations
    - DB schema can differ across migration history
    - create a new script if necessary and keep this one in older migration references
  - vercel-kysely package doesn't support transactions in migrations for some reason
  - names of stuff like production companies or actors can change
*/

export type RewaPayload = z.infer<typeof paramsSchema>;

const paramsSchema = z.object({
  tmdbId: z.number(),
  episode: z
    .object({
      title: z.string(),
      episodeOrder: z.number(),
      date: z.string().min(8).max(8),
      spotifyUrl: z.string().startsWith('https://open.spotify.com/episode'),
      hosts: z.array(z.string()),
    })
    .optional(),
  ebert: z
    .object({
      rating: z.number(),
      path: z.string().startsWith('/reviews/'),
    })
    .optional(),
});

export const insertMovie = async (db: Kysely<any>, params: z.infer<typeof paramsSchema>) => {
  const kyselyDb = db as Kysely<DB>;

  let movieId: number = 0;
  const tmdbMovie = await tmdbApi.getMovieById(params);
  console.log(`Fetched ${tmdbMovie.title}`);

  const existingMovie = await kyselyDb
    .selectFrom('movies')
    .select('id')
    .where('tmdb_id', '=', tmdbMovie.id)
    .execute();

  if (existingMovie[0]?.id) {
    movieId = existingMovie[0]?.id;
    console.log(`Movie is already in DB ${tmdbMovie.title}`);
  }

  // await kyselyDb.transaction().execute(async kyselyDb => {
  // movie ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  if (!movieId) {
    console.log(`Inserting ${tmdbMovie.title}`);

    const languages = await kyselyDb.selectFrom('languages').selectAll().execute();
    const countries = await kyselyDb.selectFrom('countries').selectAll().execute();

    const insertedMovie = await kyselyDb
      .insertInto('movies')
      .values({
        budget: tmdbMovie.budget,
        imdb_id: tmdbMovie.imdb_id,
        overview: tmdbMovie.overview,
        poster_path: tmdbMovie.poster_path,
        release_date: tmdbMovie.release_date,
        revenue: tmdbMovie.revenue,
        runtime: tmdbMovie.runtime,
        tagline: tmdbMovie.tagline,
        title: tmdbMovie.title,
        tmdb_id: tmdbMovie.id,
        language_id: languages.find(l => tmdbMovie.original_language === l.short)!.id,
        vote_average: tmdbMovie.vote_average,
        vote_count: tmdbMovie.vote_count,
        popularity: tmdbMovie.popularity,
      })
      .returning(['id'])
      .execute();

    movieId = insertedMovie[0].id;

    // actors ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    const insertedActors = await kyselyDb
      .insertInto('actors')
      .values(
        tmdbMovie.credits.cast.map(a => ({
          gender: a.gender,
          name: a.name,
          tmdb_id: a.id,
          profile_path: a.profile_path,
          popularity: a.popularity,
        }))
      )
      .onConflict(c => c.doNothing())
      .returningAll()
      .execute();

    const allActors = await kyselyDb
      .selectFrom('actors')
      .selectAll()
      .where(
        'tmdb_id',
        'in',
        tmdbMovie.credits.cast.map(c => c.id)
      )
      .execute();

    await kyselyDb
      .insertInto('actors_on_movies')
      .values(
        tmdbMovie.credits.cast.map(a => ({
          actor_id: [...insertedActors, ...allActors].find(ac => ac.tmdb_id === a.id)!.id,
          character: a.character,
          credit_id: a.credit_id,
          credit_order: a.order,
          movie_id: movieId,
        }))
      )
      .execute();

    // crew ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    const insertedCrew = await kyselyDb
      .insertInto('crew')
      .values(
        tmdbMovie.credits.crew.map(c => ({
          gender: c.gender,
          name: c.name,
          tmdb_id: c.id,
          profile_path: c.profile_path,
          popularity: c.popularity,
        }))
      )
      .onConflict(c => c.doNothing())
      .returningAll()
      .execute();

    const allCrew = await kyselyDb
      .selectFrom('crew')
      .selectAll()
      .where(
        'tmdb_id',
        'in',
        tmdbMovie.credits.crew.map(c => c.id)
      )
      .execute();

    const insertedCrewJobs = await kyselyDb
      .insertInto('crew_jobs')
      .values(
        tmdbMovie.credits.crew.map(c => ({
          department: c.department,
          job: c.job,
        }))
      )
      .onConflict(c => c.doNothing())
      .returningAll()
      .execute();

    const allCrewJobs = await kyselyDb.selectFrom('crew_jobs').selectAll().execute();

    await kyselyDb
      .insertInto('crew_on_movies')
      .values(
        tmdbMovie.credits.crew.map(c => ({
          crew_id: [...insertedCrew, ...allCrew].find(i => i.tmdb_id === c.id)!.id,
          job_id: [...insertedCrewJobs, ...allCrewJobs].find(cj => cj.job === c.job)!.id,
          credit_id: c.credit_id,
          movie_id: movieId,
        }))
      )
      .execute();

    // genres ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    const insertedGeneres = await kyselyDb
      .insertInto('genres')
      .values(tmdbMovie.genres.map(g => ({ name: g.name })))
      .onConflict(c => c.doNothing())
      .returningAll()
      .execute();

    const allGenres = await kyselyDb.selectFrom('genres').selectAll().execute();

    await kyselyDb
      .insertInto('genres_on_movies')
      .values(
        tmdbMovie.genres.map(g => ({
          genre_id: [...insertedGeneres, ...allGenres].find(ag => ag.name === g.name)!.id,
          movie_id: movieId,
        }))
      )
      .execute();

    // keywords ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    const insertedKeywords = await kyselyDb
      .insertInto('keywords')
      .values(tmdbMovie.keywords.keywords.map(k => ({ name: k.name })))
      .onConflict(c => c.doNothing())
      .returningAll()
      .execute();

    const allKeywords = await kyselyDb.selectFrom('keywords').selectAll().execute();

    await kyselyDb
      .insertInto('keywords_on_movies')
      .values(
        tmdbMovie.keywords.keywords.map(k => ({
          keyword_id: [...insertedKeywords, ...allKeywords].find(ak => ak.name === k.name)!.id,
          movie_id: movieId,
        }))
      )
      .execute();

    // production companies ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    const insertedCompanies = await kyselyDb
      .insertInto('production_companies')
      .values(
        tmdbMovie.production_companies.map(c => ({
          name: c.name,
          tmdb_id: c.id,
          logo_path: c.logo_path,
        }))
      )
      .onConflict(c => c.doNothing())
      .returningAll()
      .execute();

    const allCompanies = await kyselyDb.selectFrom('production_companies').selectAll().execute();

    await kyselyDb
      .insertInto('production_companies_on_movies')
      .values(
        tmdbMovie.production_companies.map(c => ({
          production_company_id: [...insertedCompanies, ...allCompanies].find(
            pc => pc.tmdb_id === c.id
          )!.id,
          movie_id: movieId,
        }))
      )
      .execute();

    // production countries ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    await kyselyDb
      .insertInto('production_countries_on_movies')
      .values(
        tmdbMovie.production_countries.map(pc => ({
          country_id: countries.find(c => c.short === pc.iso_3166_1)!.id,
          movie_id: movieId,
        }))
      )
      .execute();

    // spoken languages ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    await kyselyDb
      .insertInto('spoken_languages_on_movies')
      .values(
        tmdbMovie.spoken_languages.map(sl => ({
          language_id: languages.find(l => l.short === sl.iso_639_1)!.id,
          movie_id: movieId,
        }))
      )
      .execute();
  }

  // end movie inserts ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // episode ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  if (params.episode) {
    const insertedHosts = await kyselyDb
      .insertInto('hosts')
      .values(params.episode.hosts.map(h => ({ name: h })))
      .onConflict(c => c.doNothing())
      .returningAll()
      .execute();

    const allHosts = await kyselyDb.selectFrom('hosts').selectAll().execute();

    const insertedEpisode = await kyselyDb
      .insertInto('episodes')
      .values({
        date: params.episode.date,
        episode_order: params.episode.episodeOrder,
        movie_id: movieId,
        spotify_url: params.episode.spotifyUrl,
        title: params.episode.title,
      })
      .onConflict(c => c.doNothing())
      .returning('id')
      .execute();

    const episodeId = insertedEpisode[0]?.id;

    if (episodeId) {
      await kyselyDb
        .insertInto('hosts_on_episodes')
        .values(
          params.episode.hosts.map(name => ({
            episode_id: insertedEpisode[0].id!,
            host_id: [...insertedHosts, ...allHosts].find(ah => ah.name === name)!.id,
          }))
        )
        .execute();
    }
  }

  // ebert ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  if (params.ebert) {
    await kyselyDb
      .insertInto('ebert_reviews')
      .values({
        movie_id: movieId,
        rating: params.ebert.rating,
        path: params.ebert.path,
      })
      .onConflict(c => c.doNothing())
      .execute();
  }
  // });
};
