import { expressionBuilder } from 'kysely';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/sqlite';
import { crewJobs } from '~/data/crew-jobs';
import { type KyselyDB } from '../../prisma/kysley';

export const reusableSQL = {
  where: {
    moviesWithActor: (actorId: number) => {
      const eb = expressionBuilder<KyselyDB, 'movies'>();
      return eb('movies.id', 'in', ({ selectFrom }) =>
        selectFrom('actors_on_movies as jt')
          .select(['jt.movie_id'])
          .where('jt.actor_id', '=', actorId)
          .where('jt.movie_id', 'is not', null)
      );
    },
    moviesWithAnyOscar: () => {
      const eb = expressionBuilder<KyselyDB, 'movies'>();
      return eb('movies.id', 'in', ({ selectFrom }) => {
        return selectFrom('oscars_nominations as nom')
          .select(['nom.movie_id'])
          .where('nom.movie_id', 'is not', null);
      });
    },
    moviesWithAnyEpisode: () => {
      const eb = expressionBuilder<KyselyDB, 'movies'>();
      return eb('movies.id', 'in', ({ selectFrom }) => {
        return selectFrom('episodes as e')
          .select(['e.movie_id'])
          .where('e.movie_id', 'is not', null);
      });
    },
    // TODO: pretty sure this is off
    // TODO: scalar, e.g. 10k should be +-5k, b but 1b should be +-250b
    moviesWithBudget: (budget: number, comp: '~' | '>=' | '<=') => {
      const eb = expressionBuilder<KyselyDB, 'movies'>();
      if (comp === '~') {
        return eb.and([
          eb('movies.budget', '<=', budget + 5000000),
          eb('movies.budget', '>=', budget - 5000000),
        ]);
      } else {
        return eb('movies.budget', comp, budget);
      }
    },
    moviesWithCrew: (crewId: number, crewKey: keyof typeof crewJobs) => {
      const eb = expressionBuilder<KyselyDB, 'movies'>();
      return eb('movies.id', 'in', ({ selectFrom }) =>
        selectFrom('crew_on_movies as jt')
          .select(['jt.movie_id'])
          .where('jt.crew_id', '=', crewId)
          .where('jt.job_id', 'in', crewJobs[crewKey])
          .where('jt.movie_id', 'is not', null)
      );
    },
    moviesWithHost: (hostId: number) => {
      const eb = expressionBuilder<KyselyDB, 'movies'>();
      return eb('movies.id', 'in', ({ selectFrom }) =>
        selectFrom('episodes as e')
          .innerJoin('hosts_on_episodes as jt', 'jt.episode_id', 'e.id')
          .select(['e.movie_id'])
          .where('jt.host_id', '=', hostId)
          .where('e.movie_id', 'is not', null)
      );
    },
    moviesWithKeyword: (keywordId: number) => {
      const eb = expressionBuilder<KyselyDB, 'movies'>();
      return eb('movies.id', 'in', ({ selectFrom }) =>
        selectFrom('keywords_on_movies as jt')
          .select(['jt.movie_id'])
          .where('jt.keyword_id', '=', keywordId)
          .where('jt.movie_id', 'is not', null)
      );
    },
    moviesWithOscar: (categoryId: number, won?: boolean) => {
      const eb = expressionBuilder<KyselyDB, 'movies'>();
      return eb('movies.id', 'in', ({ selectFrom }) => {
        let ex = selectFrom('oscars_nominations as nom')
          .innerJoin('oscars_awards as aw', 'aw.id', 'nom.award_id')
          .select(['nom.movie_id'])
          .where('aw.category_id', '=', categoryId)
          .where('nom.movie_id', 'is not', null);
        if (won) ex = ex.where('nom.won', '=', 1);
        return ex;
      });
    },
    // TODO: scalar, e.g. 10k should be +-5k, b but 1b should be +-250b
    moviesWithRevenue: (revenue: number, comp: '~' | '>=' | '<=') => {
      const eb = expressionBuilder<KyselyDB, 'movies'>();
      if (comp === '~') {
        return eb.and([
          eb('movies.revenue', '<=', revenue + 5000), // NB: Stored as / 1000 due to BigInt shit
          eb('movies.revenue', '>=', revenue - 5000), // NB: Stored as / 1000 due to BigInt shit
        ]);
      } else {
        return eb('movies.revenue', comp, revenue);
      }
    },
    moviesWithRuntime: (runtime: number, comp: '~' | '>=' | '<=') => {
      const eb = expressionBuilder<KyselyDB, 'movies'>();
      if (comp === '~') {
        return eb.and([
          eb('movies.runtime', '<=', runtime + 5),
          eb('movies.runtime', '>=', runtime - 5),
        ]);
      } else {
        return eb('movies.runtime', comp, runtime);
      }
    },
    moviesWithStreamer: (streamerId: number) => {
      const eb = expressionBuilder<KyselyDB, 'movies'>();
      return eb('movies.id', 'in', ({ selectFrom }) =>
        selectFrom('streamers_on_movies as jt')
          .select(['jt.movie_id'])
          .where('jt.streamer_id', '=', streamerId)
          .where('jt.movie_id', 'is not', null)
      );
    },
    moviesWithYear: (year: string | number, comp: 'like' | '>=' | '<=') => {
      const eb = expressionBuilder<KyselyDB, 'movies'>();
      return eb('movies.release_date', comp, comp == 'like' ? `${year}%` : String(year));
    },
  },
  select: {
    movieActors: (limit: number) => {
      const eb = expressionBuilder<KyselyDB, 'movies'>();
      return jsonArrayFrom(
        eb
          .selectFrom('actors_on_movies as jt')
          .innerJoin('actors', 'actors.id', 'jt.actor_id')
          .select(['actors.id', 'actors.name', 'actors.profile_path'])
          .whereRef('jt.movie_id', '=', 'movies.id')
          .orderBy('jt.credit_id asc')
          .limit(limit)
      ).as('actors');
    },
    movieCrew: () => {
      const eb = expressionBuilder<KyselyDB, 'movies'>();
      return jsonArrayFrom(
        eb
          .selectFrom('crew_on_movies as jt')
          .innerJoin('crew', 'crew.id', 'jt.crew_id')
          .innerJoin('crew_jobs', 'crew_jobs.id', 'jt.job_id')
          .select(['crew.id', 'crew.name', 'crew.profile_path', 'crew_jobs.job'])
          .where('jt.job_id', 'in', Object.values(crewJobs).flat())
          .whereRef('jt.movie_id', '=', 'movies.id')
      ).as('crew');
    },
    movieEbertReview: () => {
      const eb = expressionBuilder<KyselyDB, 'movies'>();
      return jsonObjectFrom(
        eb
          .selectFrom('ebert_reviews as er')
          .select(['er.path', 'er.rating'])
          .whereRef('er.movie_id', '=', 'movies.id')
      ).as('ebert_review');
    },
    movieEpisode: () => {
      const eb = expressionBuilder<KyselyDB, 'movies'>();
      return jsonObjectFrom(
        eb
          .selectFrom('episodes as e')
          .select(['e.spotify_url', 'e.episode_order'])
          .whereRef('e.movie_id', '=', 'movies.id')
      ).as('episode');
    },
    movieGenres: () => {
      const eb = expressionBuilder<KyselyDB, 'movies'>();
      return jsonArrayFrom(
        eb
          .selectFrom('genres_on_movies as jt')
          .innerJoin('genres', 'genres.id', 'jt.genre_id')
          .select(['genres.id', 'genres.name'])
          .whereRef('jt.movie_id', '=', 'movies.id')
      ).as('genres');
    },
    movieKeywords: () => {
      const eb = expressionBuilder<KyselyDB, 'movies'>();
      return jsonArrayFrom(
        eb
          .selectFrom('keywords_on_movies as jt')
          .innerJoin('keywords', 'keywords.id', 'jt.keyword_id')
          .select(['keywords.id', 'keywords.name'])
          .whereRef('jt.movie_id', '=', 'movies.id')
      ).as('keywords');
    },
    movieStreamers: () => {
      const eb = expressionBuilder<KyselyDB, 'movies'>();
      return jsonArrayFrom(
        eb
          .selectFrom('streamers_on_movies as jt')
          .innerJoin('streamers', 'streamers.id', 'jt.streamer_id')
          .select(['streamers.id', 'streamers.name'])
          .whereRef('jt.movie_id', '=', 'movies.id')
      ).as('streamers');
    },
    movieTotalOscarNominations: () => {
      const eb = expressionBuilder<KyselyDB, 'movies'>();
      return eb
        .selectFrom('oscars_nominations as on')
        .select(eb => eb.fn.count('on.id').as('total'))
        .whereRef('on.movie_id', '=', 'movies.id')
        .as('total_oscar_nominations');
    },
    movieTotalOscarWins: () => {
      const eb = expressionBuilder<KyselyDB, 'movies'>();
      return eb
        .selectFrom('oscars_nominations as on')
        .select(eb => eb.fn.count('on.id').as('total'))
        .whereRef('on.movie_id', '=', 'movies.id')
        .as('total_oscar_wins');
    },
  },
};
