import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const searchMovies = async (searchString: string) => {
  const movies = await prisma.movies.findMany({
    select: { id: true, title: true },
    where: { title: { contains: searchString } },
    take: 5,
  });

  const actors = await prisma.actors.findMany({
    select: { id: true, name: true },
    where: { name: { contains: searchString } },
    take: 5,
  });

  const hosts = await prisma.hosts.findMany({
    select: { id: true, name: true },
    where: { name: { contains: searchString } },
    take: 5,
  });

  type Type = 'movie' | 'host' | 'actor';
  type Result = { id: number; name: string; type: Type };

  const results: Result[] = [
    ...movies.map((i) => ({ type: 'movie' as Type, id: i.id, name: i.title })),
    ...hosts.map((i) => ({ type: 'host' as Type, id: i.id, name: i.name })),
    ...actors.map((i) => ({ type: 'actor' as Type, id: i.id, name: i.name })),
  ];

  return results;

  // const movies2 = await prisma.movies.findMany({
  //   select: { id: true, title: true },
  //   where: {
  //     OR: [
  //       {
  //         title: {
  //           contains: searchString,
  //         },
  //       },
  //       {
  //         actors_on_movies: {
  //           some: {
  //             actors: {
  //               name: {
  //                 contains: searchString,
  //               },
  //             },
  //           },
  //         },
  //       },
  //       {
  //         episodes: {
  //           some: {
  //             hosts_on_episodes: {
  //               some: {
  //                 hosts: {
  //                   name: {
  //                     contains: searchString,
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     ],
  //   },
  // });
};

export type GetMoviesBySearchResponse = NonNullable<
  Awaited<ReturnType<typeof searchMovies>>
>;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<GetMoviesBySearchResponse>
) => {
  const { search } = req.query;
  if (typeof search !== 'string') {
    return res.status(200).json([]);
  } else {
    const response = await searchMovies(search);
    res.status(200).json(response);
  }
};

export default handler;
