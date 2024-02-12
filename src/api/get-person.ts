import { z } from 'zod';
import { crewJobs, crewToOscarCategory } from '~/data/crew-jobs';
import { movieFilters } from '~/data/movie-search-conditions';
import { parsedQpSchema } from '~/data/query-params';
import { Prisma } from '~/prisma';
import { appEnums } from '~/utils/enums';
import { getYear } from '~/utils/format';
import { sortMovies } from '~/utils/sorting';

const prisma = Prisma.getPrisma();

type Response = {
  id: number;
  name: string;
  image: string | null;
  movies: {
    oscar: { award: string; won: boolean } | undefined;
    character?: string;
    id: number;
    releaseDate: string;
    title: string;
    year: string;
  }[];
};

type GetPersonParams = z.infer<typeof getPersonParams>;

export const getPersonParams = z.object({
  id: z.number(),
  field: appEnums.topCategory.schema,
  subField: appEnums.topCategorySub.schema,
  params: parsedQpSchema,
});

export const getPerson = async (params: GetPersonParams): Promise<Response> => {
  if (params.field === 'actor') {
    return getActor(params);
  } else {
    return getCrew(params);
  }
};

export const getActor = async ({ id, subField, params }: GetPersonParams) => {
  const actorResponse = await prisma.actors.findFirstOrThrow({
    where: { id },
    include: {
      actors_on_movies: {
        where: {
          movies: movieFilters(params),
        },
        include: {
          movies: {
            select: {
              title: true,
              release_date: true,
              id: true,
              oscars_nominations: {
                include: {
                  actors_on_oscars: true,
                  award: { include: { oscars_categories: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  const movies = actorResponse.actors_on_movies
    .filter(om => om.movies)
    .map(role => {
      const oscar = role.movies.oscars_nominations.find(nom =>
        nom.actors_on_oscars.find(a => a.actor_id === role.actor_id)
      );
      return {
        oscar: oscar ? { award: oscar.award.oscars_categories.name, won: oscar.won } : undefined,
        character: role.character,
        id: role.movie_id,
        releaseDate: role.movies.release_date,
        title: role.movies.title,
        year: getYear(role.movies.release_date),
      };
    })
    .filter(role => {
      if (subField === 'mostNoms') return role.oscar;
      if (subField === 'mostWins') return role.oscar?.won;
      return true;
    });

  return {
    id,
    name: actorResponse.name,
    image: actorResponse.profile_path,
    movies: sortMovies(movies),
  };
};

// TODO: need to change the oscar logic - noms and wins should to be tied to the specific award

export const getCrew = async ({ id, field, subField, params }: GetPersonParams) => {
  if (field === 'actor') throw new Error('No actors allowed');
  const response = await prisma.crew.findFirstOrThrow({
    where: { id },
    include: {
      crew_on_movies: {
        where: {
          movies: movieFilters(params),
          job: { in: crewJobs[field] },
        },
        include: {
          movies: {
            select: {
              title: true,
              release_date: true,
              id: true,
              oscars_nominations: {
                include: {
                  crew_on_oscars: true,
                  award: { include: { oscars_categories: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  const movies = response.crew_on_movies
    .filter(om => om.movies)
    .map(role => {
      const oscar = role.movies.oscars_nominations.find(
        nom =>
          nom.crew_on_oscars.find(a => a.crew_id === role.crew_id) &&
          crewToOscarCategory[field].includes(nom.award.category_id)
      );
      return {
        job: role.job,
        oscar: oscar
          ? {
              award: oscar.award.oscars_categories.name,
              won: oscar.won,
              categoryName: oscar.award.name,
            }
          : undefined,
        id: role.movie_id,
        releaseDate: role.movies.release_date,
        title: role.movies.title,
        year: getYear(role.movies.release_date),
      };
    })
    .filter(role => {
      if (subField === 'mostFilms') {
        return true;
      } else if (subField === 'mostNoms') {
        return role.oscar;
      } else if (subField === 'mostWins') {
        return role.oscar?.won;
      } else {
        return true;
      }
    });

  return {
    id,
    name: response.name,
    image: response.profile_path,
    movies: sortMovies(movies),
  };
};
