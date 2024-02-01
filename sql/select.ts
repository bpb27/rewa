import { Prisma } from '../src/prisma';

const prisma = Prisma.getPrisma();

const byTmdbId = (id: number) => ({
  where: {
    tmdb_id: id,
  },
});

const byName = (name: string) => ({ where: { name } });

export const getActorByTmdbId = (id: number) => prisma.actors.findFirst(byTmdbId(id));

export const getActorByName = (name: string) => prisma.actors.findFirst(byName(name));

export const getProductionCompanyByTmdbId = (id: number) =>
  prisma.production_companies.findFirst(byTmdbId(id));

export const getCrewByTmdbId = (id: number) => prisma.crew.findFirst(byTmdbId(id));

export const getCrewByName = (name: string) => prisma.crew.findFirst(byName(name));

export const getEpisodeByUrl = (url: string) =>
  prisma.episodes.findFirst({ where: { spotify_url: url } });

export const getGenreByName = (name: string) => prisma.genres.findFirst(byName(name));

export const getHostByName = (name: string) => prisma.hosts.findFirst(byName(name));

export const getKeywordByName = (name: string) => prisma.keywords.findFirst(byName(name));

export const getMovieByTmdbId = (id: number) => prisma.movies.findFirst(byTmdbId(id));

export const getMovieByName = (title: string, year: number) =>
  prisma.movies.findFirst({
    where: {
      title,
      release_date: { startsWith: year.toString() },
    },
  });

export const getAllMoviesWithEpisodes = () =>
  prisma.movies.findMany({
    where: { episodes: { some: {} } },
    select: { id: true, tmdb_id: true, title: true, release_date: true },
  });

export const getAllMoviesWithHighOscars = () =>
  prisma.movies.findMany({
    select: { id: true, title: true, tmdb_id: true },
    where: {
      oscars_nominations: {
        some: { award: { AND: { oscars_categories: { relevance: 'high' } } } },
      },
    },
  });

export const getAllMovies = () =>
  prisma.movies.findMany({
    select: { id: true, title: true, release_date: true, tmdb_id: true },
  });

export const getAllStreamers = () =>
  prisma.streamers.findMany({ select: { id: true, name: true } });

export const getAllAwards = () => prisma.oscars_awards.findMany();

export const getAwardByName = (name: string) =>
  prisma.oscars_awards.findFirst({
    where: { name },
  });

export const getAllOscarCategories = () => prisma.oscars_categories.findMany();

export const getOscarNom = ({
  awardId,
  movieId,
  recipient,
}: {
  awardId: number;
  movieId: number;
  recipient: string;
}) =>
  prisma.oscars_nominations.findFirst({
    where: {
      award_id: awardId,
      movie_id: movieId,
      recipient,
    },
  });

export const getActorsOnMovie = (movieId: number) =>
  prisma.actors_on_movies.findMany({
    where: { movie_id: movieId },
    include: { actors: true },
  });

export const getCrewOnMovie = (movieId: number) =>
  prisma.crew_on_movies.findMany({
    where: { movie_id: movieId },
    include: { crew: true },
  });
