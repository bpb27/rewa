import { z } from 'zod';
import { crewJobs } from '~/data/crew-jobs';
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

export const getPersonParams = z.object({
  id: z.number(),
  filter: appEnums.movieMode.schema,
  field: appEnums.topCategory.schema,
});

export const getPerson = async ({
  field,
  ...params
}: z.infer<typeof getPersonParams>): Promise<Response> => {
  if (field === 'actor' || field === 'actorNoms') {
    return getActor({ ...params, field });
  } else {
    return getCrew({ ...params, field });
  }
};

export const getActorParams = z.object({
  id: z.number(),
  filter: appEnums.movieMode.schema,
  field: appEnums.topCategory.schema.extract(['actor', 'actorNoms']),
});

export const getActor = async ({ id, field, filter }: z.infer<typeof getActorParams>) => {
  const actorResponse = await prisma.actors.findFirstOrThrow({
    where: { id },
    include: {
      actors_on_movies: {
        where: {
          movies: {
            ...(filter === 'rewa' ? { episodes: { some: {} } } : undefined),
            ...(filter === 'oscar' ? { oscars_nominations: { some: {} } } : undefined),
          },
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
    .filter(role => (field === 'actorNoms' ? role.oscar : true));

  return {
    id,
    name: actorResponse.name,
    image: actorResponse.profile_path,
    movies: sortMovies(movies),
  };
};

export const getCrewParams = z.object({
  id: z.number(),
  filter: appEnums.movieMode.schema,
  field: appEnums.topCategory.schema.exclude(['actor', 'actorNoms']),
});

export const getCrew = async ({ id, field, filter }: z.infer<typeof getCrewParams>) => {
  const response = await prisma.crew.findFirstOrThrow({
    where: { id },
    include: {
      crew_on_movies: {
        where: {
          movies: {
            ...(filter === 'rewa' ? { episodes: { some: {} } } : undefined),
            ...(filter === 'oscar' ? { oscars_nominations: { some: {} } } : undefined),
          },
          job: { in: crewJobs[field === 'directorNoms' ? 'director' : field] },
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
      const oscar = role.movies.oscars_nominations.find(nom =>
        nom.crew_on_oscars.find(a => a.crew_id === role.crew_id)
      );
      return {
        oscar: oscar ? { award: oscar.award.oscars_categories.name, won: oscar.won } : undefined,
        id: role.movie_id,
        releaseDate: role.movies.release_date,
        title: role.movies.title,
        year: getYear(role.movies.release_date),
      };
    })
    .filter(role => (field === 'directorNoms' ? role.oscar : true));

  return {
    id,
    name: response.name,
    image: response.profile_path,
    movies: sortMovies(movies),
  };
};
