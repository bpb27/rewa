import { Prisma } from '../src/prisma';

const prisma = Prisma.getPrisma();

const byTmdbId = (id: number) => ({
  where: {
    tmdb_id: id,
  },
});

export const getActorByTmdbId = (id: number) => prisma.actors.findFirst(byTmdbId(id));

export const getProductionCompanyByTmdbId = (id: number) =>
  prisma.production_companies.findFirst(byTmdbId(id));

export const getCrewByTmdbId = (id: number) => prisma.crew.findFirst(byTmdbId(id));

export const getEpisodeByUrl = (url: string) =>
  prisma.episodes.findFirst({ where: { spotify_url: url } });

export const getGenreByName = (name: string) => prisma.genres.findFirst({ where: { name } });

export const getHostByName = (name: string) => prisma.hosts.findFirst({ where: { name } });

export const getMovieByTmdbId = (id: number) => prisma.movies.findFirst(byTmdbId(id));

export const getAllMoviesWithEpisodes = () =>
  prisma.movies.findMany({
    where: { episodes: { some: {} } },
    select: { id: true, tmdb_id: true, title: true },
  });

export const getAllMovies = () =>
  prisma.movies.findMany({
    select: { id: true, title: true, release_date: true, tmdb_id: true },
  });

export const getAllStreamers = () =>
  prisma.streamers.findMany({ select: { id: true, name: true } });

export const getAllAwards = () => prisma.oscars_awards.findMany();
