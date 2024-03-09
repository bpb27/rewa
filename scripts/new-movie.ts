import { z } from 'zod';
import { kyselyDb } from '../pg/db';
import { tmdbApi } from './tmbd-api';

// prettier-ignore
const hosts = z.enum(['Bill Simmons','Mallory Rubin','Van Lathan','Logan Murdock','Chris Ryan','Sean Fennessey','Juliet Litman','Amanda Dobbins','Ryen Russillo','Craig Horlbeck','Kyle Brandt','Wesley Morris','Danny Kelly','Danny Heifetz','Jodi Walker','Kate Halliwell','Brian Koppelman','Shea Serrano','Wosny Lambre','David Jacoby','Cousin Sal','Gus Ramsey','Charles Holmes','K. Austin Collins','Jimmy Kimmel','Andy Greenwald','Mina Kimes','Chuck Klosterman','Bill Hader','Bill Lawrence','Liz Kelly','Judd Apatow','Jason Concepcion','Issa Rae','Jemele Hill','Quentin Tarantino','The Safdie Brothers','Kari Simmons','Rembert Browne','Bill’s Dad','Aaron Sorkin','Andrew Gruttadaro','Micah Peters','David Shoemaker','Bryan Curtis','Justin Charity','Lindsay Zoladz','Donnie Kwak','Hannah Giorgis','Mark Titus','Dave Chang','Jennifer Lawrence','Zach Baron']).enum;

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

const run = async (params: z.infer<typeof paramsSchema>) => {
  let movieId: number;
  const tmdbMovie = await tmdbApi.getMovieById(params);

  const existingMovie = await kyselyDb
    .selectFrom('movies')
    .select('id')
    .where('tmdb_id', '=', tmdbMovie.id)
    .execute();

  if (existingMovie[0]?.id) {
    movieId = existingMovie[0]?.id;
  }

  await kyselyDb.transaction().execute(async trx => {
    // movie ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    if (!movieId) {
      const insertedMovie = await trx
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

      const insertedActors = await trx
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

      const allActors = await trx
        .selectFrom('actors')
        .selectAll()
        .where(
          'tmdb_id',
          'in',
          tmdbMovie.credits.cast.map(c => c.id)
        )
        .execute();

      await trx
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

      const insertedCrew = await trx
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

      const allCrew = await trx
        .selectFrom('crew')
        .selectAll()
        .where(
          'tmdb_id',
          'in',
          tmdbMovie.credits.crew.map(c => c.id)
        )
        .execute();

      const insertedCrewJobs = await trx
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

      const allCrewJobs = await trx.selectFrom('crew_jobs').selectAll().execute();

      await trx
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

      const insertedGeneres = await trx
        .insertInto('genres')
        .values(tmdbMovie.genres.map(g => ({ name: g.name })))
        .onConflict(c => c.doNothing())
        .returningAll()
        .execute();

      const allGenres = await trx.selectFrom('genres').selectAll().execute();

      await trx
        .insertInto('genres_on_movies')
        .values(
          tmdbMovie.genres.map(g => ({
            genre_id: [...insertedGeneres, ...allGenres].find(ag => ag.name === g.name)!.id,
            movie_id: movieId,
          }))
        )
        .execute();

      // keywords ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      const insertedKeywords = await trx
        .insertInto('keywords')
        .values(tmdbMovie.keywords.keywords.map(k => ({ name: k.name })))
        .onConflict(c => c.doNothing())
        .returningAll()
        .execute();

      const allKeywords = await trx.selectFrom('keywords').selectAll().execute();

      await trx
        .insertInto('keywords_on_movies')
        .values(
          tmdbMovie.keywords.keywords.map(k => ({
            keyword_id: [...insertedKeywords, ...allKeywords].find(ak => ak.name === k.name)!.id,
            movie_id: movieId,
          }))
        )
        .execute();

      // production ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      const insertedCompanies = await trx
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

      const allCompanies = await trx.selectFrom('production_companies').selectAll().execute();

      await trx
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
      const insertedHosts = await trx
        .insertInto('hosts')
        .values(params.episode.hosts.map(h => ({ name: h })))
        .onConflict(c => c.doNothing())
        .returningAll()
        .execute();

      const allHosts = await trx.selectFrom('hosts').selectAll().execute();

      const insertedEpisode = await trx
        .insertInto('episodes')
        .values({
          date: params.episode.date,
          episode_order: params.episode.episodeOrder,
          movie_id: movieId,
          spotify_url: params.episode.spotifyUrl,
          title: params.episode.title,
        })
        .returning('id')
        .execute();

      await trx
        .insertInto('hosts_on_episodes')
        .values(
          params.episode.hosts.map(name => ({
            episode_id: insertedEpisode[0].id!,
            host_id: [...insertedHosts, ...allHosts].find(ah => ah.name === name)!.id,
          }))
        )
        .execute();
    }

    // ebert ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    if (params.ebert) {
      await trx
        .insertInto('ebert_reviews')
        .values({
          movie_id: movieId,
          rating: params.ebert.rating,
          path: params.ebert.path,
        })
        .execute();
    }
  });
};

run({
  tmdbId: 10135,
  ebert: {
    path: '/reviews/road-house-1989',
    rating: 2.5,
  },
  episode: {
    spotifyUrl: 'https://open.spotify.com/episode/50fPq9jcb71Vg7d32CiW2Q?si=b1a91fd553164185',
    title: 'Road House',
    hosts: [hosts['Bill Simmons'], hosts['Chris Ryan'], hosts['Kyle Brandt']],
    date: 'Mar 2024',
    episodeOrder: 331,
  },
}).then(() => kyselyDb.destroy());
