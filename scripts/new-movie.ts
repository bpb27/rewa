import { z } from 'zod';
import { localDb, remoteDb } from '../pg/db';
import { tmdbApi } from './tmbd-api';

const paramsSchema = z.object({
  where: z.enum(['local', 'remote']),
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

const run = async (params: z.infer<typeof paramsSchema>) => {
  const kyselyDb = params.where === 'local' ? localDb() : remoteDb(process.env.PROD_DATABASE_URL);

  let movieId: number = 0;
  const tmdbMovie = await tmdbApi.getMovieById(params);

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

    // production ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
            pc => pc.name === c.name
          )!.id,
          movie_id: movieId,
        }))
      )
      .execute();
  }

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

  kyselyDb.destroy();
};

// prettier-ignore
const hosts = z.enum(['Bill Simmons','Mallory Rubin','Van Lathan','Logan Murdock','Chris Ryan','Sean Fennessey','Juliet Litman','Amanda Dobbins','Ryen Russillo','Craig Horlbeck','Kyle Brandt','Wesley Morris','Danny Kelly','Danny Heifetz','Jodi Walker','Kate Halliwell','Brian Koppelman','Shea Serrano','Wosny Lambre','David Jacoby','Cousin Sal','Gus Ramsey','Charles Holmes','K. Austin Collins','Jimmy Kimmel','Andy Greenwald','Mina Kimes','Chuck Klosterman','Bill Hader','Bill Lawrence','Liz Kelly','Judd Apatow','Jason Concepcion','Issa Rae','Jemele Hill','Quentin Tarantino','The Safdie Brothers','Kari Simmons','Rembert Browne','Bill’s Dad','Aaron Sorkin','Andrew Gruttadaro','Micah Peters','David Shoemaker','Bryan Curtis','Justin Charity','Lindsay Zoladz','Donnie Kwak','Hannah Giorgis','Mark Titus','Dave Chang','Jennifer Lawrence','Zach Baron']).enum;

run({
  where: 'local',
  tmdbId: 249,
  ebert: {
    path: '/reviews/the-war-of-the-roses-1989',
    rating: 3,
  },
  episode: {
    spotifyUrl: 'https://open.spotify.com/episode/6eikEb3398eM59pmfpW32X?si=f120a1bc86274b3e',
    title: 'The War of the Roses',
    hosts: [hosts['Bill Simmons'], hosts['Mallory Rubin'], hosts['Amanda Dobbins']],
    date: 'Apr 2024',
    episodeOrder: 336,
  },
});
