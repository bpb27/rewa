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
