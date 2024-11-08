import { expressionBuilder, sql } from 'kysely';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';
import { crewJobs } from '~/data/crew-jobs';
import { QpSchema } from '~/data/query-params';
import { AppEnums } from '~/utils/enums';
import { type DB } from '../../pg/generated';

export const reusableSQL = {
  where: {
    moviesWithActor: (actorId: number) => {
      const eb = expressionBuilder<DB, 'movies'>();
      return eb('movies.id', 'in', ({ selectFrom }) =>
        selectFrom('actors_on_movies as jt')
          .select(['jt.movie_id'])
          .where('jt.actor_id', '=', actorId)
          .where('jt.movie_id', 'is not', null)
      );
    },
    movieMode: (mode: AppEnums['movieMode']) => {
      const eb = expressionBuilder<DB, 'movies'>();
      if (mode === 'oscar') {
        return eb('movies.id', 'in', ({ selectFrom }) => {
          return selectFrom('oscars_nominations as nom')
            .select(['nom.movie_id'])
            .where('nom.movie_id', 'is not', null);
        });
      } else if (mode === 'rewa') {
        return eb('movies.id', 'in', ({ selectFrom }) => {
          return selectFrom('episodes as e')
            .select(['e.movie_id'])
            .where('e.movie_id', 'is not', null);
        });
      } else {
        return eb('movies.id', 'is not', null);
      }
    },
    moviesWithAnyOscar: () => {
      const eb = expressionBuilder<DB, 'movies'>();
      return eb('movies.id', 'in', ({ selectFrom }) => {
        return selectFrom('oscars_nominations as nom')
          .select(['nom.movie_id'])
          .where('nom.movie_id', 'is not', null);
      });
    },
    moviesWithAnyEpisode: () => {
      const eb = expressionBuilder<DB, 'movies'>();
      return eb('movies.id', 'in', ({ selectFrom }) => {
        return selectFrom('episodes as e')
          .select(['e.movie_id'])
          .where('e.movie_id', 'is not', null);
      });
    },
    moviesWithBudget: (budget: number, comp: '~' | '>=' | '<=') => {
      const eb = expressionBuilder<DB, 'movies'>();
      if (comp === '~') {
        return eb.and([
          eb('movies.budget', '<=', Math.round(budget + budget * 0.1).toString()),
          eb('movies.budget', '>=', Math.round(budget - budget * 0.1).toString()),
        ]);
      } else {
        return eb('movies.budget', comp, budget.toString());
      }
    },
    moviesWithCrew: (crewId: number, crewKey: keyof typeof crewJobs) => {
      const eb = expressionBuilder<DB, 'movies'>();
      return eb('movies.id', 'in', ({ selectFrom }) =>
        selectFrom('crew_on_movies as jt')
          .select(['jt.movie_id'])
          .where('jt.crew_id', '=', crewId)
          .where('jt.job_id', 'in', crewJobs[crewKey])
          .where('jt.movie_id', 'is not', null)
      );
    },
    moviesWithGenre: (genreId: number) => {
      const eb = expressionBuilder<DB, 'movies'>();
      return eb('movies.id', 'in', ({ selectFrom }) =>
        selectFrom('genres_on_movies as jt')
          .select(['jt.movie_id'])
          .where('jt.genre_id', '=', genreId)
          .where('jt.movie_id', 'is not', null)
      );
    },
    moviesWithCountry: (countryId: number) => {
      const eb = expressionBuilder<DB, 'movies'>();
      return eb('movies.id', 'in', ({ selectFrom }) =>
        selectFrom('production_countries_on_movies as jt')
          .select(['jt.movie_id'])
          .where('jt.country_id', '=', countryId)
          .where('jt.movie_id', 'is not', null)
      );
    },
    moviesWithLanguage: (languageId: number) => {
      const eb = expressionBuilder<DB, 'movies'>();
      return eb('movies.id', 'in', ({ selectFrom }) =>
        selectFrom('spoken_languages_on_movies as jt')
          .select(['jt.movie_id'])
          .where('jt.language_id', '=', languageId)
          .where('jt.movie_id', 'is not', null)
      );
    },
    moviesWithHost: (hostId: number) => {
      const eb = expressionBuilder<DB, 'movies'>();
      return eb('movies.id', 'in', ({ selectFrom }) =>
        selectFrom('episodes as e')
          .innerJoin('hosts_on_episodes as jt', 'jt.episode_id', 'e.id')
          .select(['e.movie_id'])
          .where('jt.host_id', '=', hostId)
          .where('e.movie_id', 'is not', null)
      );
    },
    moviesWithKeyword: (keywordId: number) => {
      const eb = expressionBuilder<DB, 'movies'>();
      return eb('movies.id', 'in', ({ selectFrom }) =>
        selectFrom('keywords_on_movies as jt')
          .select(['jt.movie_id'])
          .where('jt.keyword_id', '=', keywordId)
          .where('jt.movie_id', 'is not', null)
      );
    },
    moviesWithOscar: (categoryId: number, won?: boolean) => {
      const eb = expressionBuilder<DB, 'movies'>();
      return eb('movies.id', 'in', ({ selectFrom }) => {
        let ex = selectFrom('oscars_nominations as nom')
          .innerJoin('oscars_awards as aw', 'aw.id', 'nom.award_id')
          .select(['nom.movie_id'])
          .where('aw.category_id', '=', categoryId)
          .where('nom.movie_id', 'is not', null);
        if (won) ex = ex.where('nom.won', '=', true);
        return ex;
      });
    },
    moviesWithRevenue: (revenue: number, comp: '~' | '>=' | '<=') => {
      const eb = expressionBuilder<DB, 'movies'>();
      if (comp === '~') {
        return eb.and([
          eb('movies.revenue', '<=', Math.round(revenue + revenue * 0.1).toString()),
          eb('movies.revenue', '>=', Math.round(revenue - revenue * 0.1).toString()),
        ]);
      } else {
        return eb('movies.revenue', comp, revenue.toString());
      }
    },
    moviesWithRuntime: (runtime: number, comp: '~' | '>=' | '<=') => {
      const eb = expressionBuilder<DB, 'movies'>();
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
      const eb = expressionBuilder<DB, 'movies'>();
      return eb('movies.id', 'in', ({ selectFrom }) =>
        selectFrom('streamers_on_movies as jt')
          .select(['jt.movie_id'])
          .where('jt.streamer_id', '=', streamerId)
          .where('jt.movie_id', 'is not', null)
      );
    },
    moviesWithYear: (year: string | number, comp: 'like' | '>=' | '<=') => {
      const eb = expressionBuilder<DB, 'movies'>();
      if (comp === 'like') {
        return eb(sql`EXTRACT(YEAR FROM movies.release_date)`, '=', year);
      }
      return eb('movies.release_date', comp, new Date(`${year}-01-01`));
    },
  },
  select: {
    movieActors: (limit: number) => {
      const eb = expressionBuilder<DB, 'movies'>();
      return jsonArrayFrom(
        eb
          .selectFrom('actors_on_movies as jt')
          .innerJoin('actors', 'actors.id', 'jt.actor_id')
          .select(['actors.id', 'actors.name', 'actors.profile_path as image'])
          .whereRef('jt.movie_id', '=', 'movies.id')
          .orderBy('jt.credit_order asc')
          .limit(limit)
      ).as('actors');
    },
    movieCrew: () => {
      const eb = expressionBuilder<DB, 'movies'>();
      return jsonArrayFrom(
        eb
          .selectFrom('crew_on_movies as jt')
          .innerJoin('crew', 'crew.id', 'jt.crew_id')
          .select(['crew.id', 'crew.name', 'crew.profile_path as image', 'jt.job_id'])
          .where('jt.job_id', 'in', Object.values(crewJobs).flat())
          .whereRef('jt.movie_id', '=', 'movies.id')
      ).as('crew');
    },
    movieEbertReview: () => {
      const eb = expressionBuilder<DB, 'movies'>();
      return jsonObjectFrom(
        eb
          .selectFrom('ebert_reviews as er')
          .select(['er.path as reviewUrl', 'er.rating'])
          .whereRef('er.movie_id', '=', 'movies.id')
      ).as('ebert_review');
    },
    movieEpisode: () => {
      const eb = expressionBuilder<DB, 'movies'>();
      return jsonObjectFrom(
        eb
          .selectFrom('episodes as e')
          .select([
            'e.spotify_url as spotifyUrl',
            'e.episode_order as episodeOrder',
            eb =>
              jsonArrayFrom(
                eb
                  .selectFrom('hosts_on_episodes as jt')
                  .innerJoin('hosts', 'hosts.id', 'jt.host_id')
                  .select(['hosts.id', 'hosts.name'])
                  .whereRef('e.id', '=', 'jt.episode_id')
                  .orderBy('hosts.name asc')
              ).as('hosts'),
          ])
          .whereRef('e.movie_id', '=', 'movies.id')
          .limit(1)
      ).as('episode');
    },
    movieOscars: () => {
      const eb = expressionBuilder<DB, 'movies'>();
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
      const eb = expressionBuilder<DB, 'movies'>();
      return jsonArrayFrom(
        eb
          .selectFrom('genres_on_movies as jt')
          .innerJoin('genres', 'genres.id', 'jt.genre_id')
          .select(['genres.id', 'genres.name'])
          .whereRef('jt.movie_id', '=', 'movies.id')
      ).as('genres');
    },
    movieKeywords: () => {
      const eb = expressionBuilder<DB, 'movies'>();
      return jsonArrayFrom(
        eb
          .selectFrom('keywords_on_movies as jt')
          .innerJoin('keywords', 'keywords.id', 'jt.keyword_id')
          .select(['keywords.id', 'keywords.name', eb => eb.fn.count('jt.movie_id').as('count')])
          .groupBy('keywords.id')
          .whereRef('jt.movie_id', '=', 'movies.id')
          .orderBy('count desc')
      ).as('keywords');
    },
    movieStreamers: () => {
      const eb = expressionBuilder<DB, 'movies'>();
      return jsonArrayFrom(
        eb
          .selectFrom('streamers_on_movies as jt')
          .innerJoin('streamers', 'streamers.id', 'jt.streamer_id')
          .select(['streamers.id', 'streamers.name'])
          .whereRef('jt.movie_id', '=', 'movies.id')
          .orderBy('streamers.id asc')
      ).as('streamers');
    },
    movieTotalOscarNominations: () => {
      const eb = expressionBuilder<DB, 'movies'>();
      return eb
        .selectFrom('oscars_nominations as on')
        .select(eb => eb.fn.countAll().as('total'))
        .whereRef('on.movie_id', '=', 'movies.id')
        .as('total_oscar_nominations');
    },
    movieTotalOscarWins: () => {
      const eb = expressionBuilder<DB, 'movies'>();
      return eb
        .selectFrom('oscars_nominations as on')
        .select(eb => eb.fn.countAll().as('total'))
        .where('on.won', '=', true)
        .whereRef('on.movie_id', '=', 'movies.id')
        .as('total_oscar_wins');
    },
  },
};

export const allMovieFilters = (params: QpSchema) => {
  const { where } = reusableSQL;
  const eb = expressionBuilder<DB, 'movies'>();
  const searches = [
    ...(params.movie.length ? [eb('movies.id', 'in', params.movie)] : []),
    ...params.cinematographer.map(id => where.moviesWithCrew(id, 'cinematographer')),
    ...params.composer.map(id => where.moviesWithCrew(id, 'composer')),
    ...params.director.map(id => where.moviesWithCrew(id, 'director')),
    ...params.producer.map(id => where.moviesWithCrew(id, 'producer')),
    ...params.writer.map(id => where.moviesWithCrew(id, 'writer')),
    ...params.actor.map(id => where.moviesWithActor(id)),
    ...params.keyword.map(id => where.moviesWithKeyword(id)),
    ...params.genre.map(id => where.moviesWithGenre(id)),
    ...params.language.map(id => where.moviesWithLanguage(id)),
    ...params.country.map(id => where.moviesWithCountry(id)),
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
  ];
  if (searches.length) {
    return eb.and([where.movieMode(params.movieMode), eb[params.searchMode](searches)]);
  } else {
    return where.movieMode(params.movieMode);
  }
};
