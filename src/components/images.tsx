import Image from 'next/image';
import { type PropsWithChildren } from 'react';

export const tmdbImage = (path: string) => `https://image.tmdb.org/t/p/original${path}`;

export const moviePosterSize = (width: number) => ({
  width,
  height: Math.round(width * 1.66),
});

export const TheaterBackground = ({ children }: PropsWithChildren<{}>) => (
  <div className="flex w-full justify-center rounded-xl border-2 border-solid border-slate-900 bg-gradient-to-r from-slate-500 via-slate-900 to-slate-500">
    {children}
  </div>
);

export const MovieCardPoster = ({
  poster_path,
  size = 100,
  title,
}: {
  size?: number;
  poster_path: string;
  title: string;
}) => (
  <Image
    className="border-x-2 border-solid border-slate-900"
    src={`https://image.tmdb.org/t/p/original${poster_path}`}
    alt={`Poster for ${title}`}
    {...moviePosterSize(size)}
  />
);

export const MovieTablePoster = ({
  poster_path,
  title,
}: {
  poster_path: string;
  title: string;
}) => (
  <Image
    className="border-2 border-solid border-slate-500"
    src={`https://image.tmdb.org/t/p/original${poster_path}`}
    alt={`Movie poster for ${title}`}
    {...moviePosterSize(62)}
  />
);
