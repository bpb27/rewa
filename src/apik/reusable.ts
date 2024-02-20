import { expressionBuilder } from 'kysely';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/sqlite';
import { crewJobs } from '~/data/crew-jobs';
import { QpSchema } from '~/data/query-params';
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
          .select(['crew.id', 'crew.name', 'crew.profile_path', 'jt.job_id'])
          .where('jt.job_id', 'in', Object.values(crewJobs).flat())
          .whereRef('jt.movie_id', '=', 'movies.id')
      ).as('crew');
    },
    movieEbertReview: () => {
      const eb = expressionBuilder<KyselyDB, 'movies'>();
      return jsonObjectFrom(
        eb
          .selectFrom('ebert_reviews as er')
          .select(['er.path as reviewUrl', 'er.rating'])
          .whereRef('er.movie_id', '=', 'movies.id')
      ).as('ebert_review');
    },
    movieEpisode: () => {
      const eb = expressionBuilder<KyselyDB, 'movies'>();
      return jsonObjectFrom(
        eb
          .selectFrom('episodes as e')
          .select([
            'e.spotify_url',
            'e.episode_order',
            eb =>
              jsonArrayFrom(
                eb
                  .selectFrom('hosts_on_episodes as jt')
                  .innerJoin('hosts', 'hosts.id', 'jt.host_id')
                  .select(['hosts.id', 'hosts.name'])
                  .whereRef('e.id', '=', 'jt.episode_id')
              ).as('hosts'),
          ])
          .whereRef('e.movie_id', '=', 'movies.id')
          .limit(1)
      ).as('episode');
    },
    movieOscars: () => {
      const eb = expressionBuilder<KyselyDB, 'movies'>();
      return jsonArrayFrom(
        eb
          .selectFrom('oscars_nominations')
          .innerJoin('oscars_awards', 'oscars_awards.id', 'oscars_nominations.award_id')
          .innerJoin('oscars_categories', 'oscars_categories.id', 'oscars_awards.category_id')
          .select([
            'oscars_nominations.won',
            'oscars_nominations.recipient',
            'oscars_awards.name as award',
            'oscars_categories.name as category',
            'oscars_nominations.ceremony_year as ceremonyYear',
          ])
          .whereRef('oscars_nominations.movie_id', '=', 'movies.id')
      ).as('oscars');
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
        .select(eb => eb.fn.countAll().$castTo<number>().as('total'))
        .whereRef('on.movie_id', '=', 'movies.id')
        .as('total_oscar_nominations');
    },
    movieTotalOscarWins: () => {
      const eb = expressionBuilder<KyselyDB, 'movies'>();
      return eb
        .selectFrom('oscars_nominations as on')
        .select(eb => eb.fn.countAll().$castTo<number>().as('total'))
        .where('on.won', '=', 1)
        .whereRef('on.movie_id', '=', 'movies.id')
        .as('total_oscar_wins');
    },
  },
};

export const allMovieFilters = (params: QpSchema) => {
  const { where } = reusableSQL;
  const eb = expressionBuilder<KyselyDB, 'movies'>();
  return eb.and([
    ...(params.movieMode === 'rewa' ? [where.moviesWithAnyEpisode()] : []),
    ...(params.movieMode === 'oscar' ? [where.moviesWithAnyOscar()] : []),
    eb[params.searchMode]([
      ...(params.movie.length ? [eb('movies.id', 'in', params.movie)] : []),
      ...params.cinematographer.map(id => where.moviesWithCrew(id, 'cinematographer')),
      ...params.director.map(id => where.moviesWithCrew(id, 'director')),
      ...params.producer.map(id => where.moviesWithCrew(id, 'producer')),
      ...params.writer.map(id => where.moviesWithCrew(id, 'writer')),
      ...params.actor.map(id => where.moviesWithActor(id)),
      ...params.keyword.map(id => where.moviesWithKeyword(id)),
      ...params.streamer.map(id => where.moviesWithStreamer(id)),
      ...params.host.map(id => where.moviesWithHost(id)),
      ...params.oscarsCategoriesNom.map(id => where.moviesWithOscar(id)),
      ...params.oscarsCategoriesWon.map(id => where.moviesWithOscar(id, true)),
      ...params.year.map(id => where.moviesWithYear(id, 'like')),
      ...params.yearGte.map(id => where.moviesWithYear(id, '>=')),
      ...params.yearLte.map(id => where.moviesWithYear(id, '<=')),
      ...params.runtime.map(id => where.moviesWithRuntime(id, '~')),
      ...params.runtimeGte.map(id => where.moviesWithRuntime(id, '>=')),
      ...params.runtimeLte.map(id => where.moviesWithRuntime(id, '<=')),
      ...params.budget.map(id => where.moviesWithBudget(id, '~')),
      ...params.budgetGte.map(id => where.moviesWithBudget(id, '>=')),
      ...params.budgetLte.map(id => where.moviesWithBudget(id, '<=')),
      ...params.revenue.map(id => where.moviesWithRevenue(id, '~')),
      ...params.revenueGte.map(id => where.moviesWithRevenue(id, '>=')),
      ...params.revenueLte.map(id => where.moviesWithRevenue(id, '<=')),
    ]),
  ]);
};
