// NB: one outside definition in next.config.js
// NB: should match /pages file-based routing

import { type AppEnums } from './enums';

type Mode = 'rewa' | 'oscars';
type Base = `/${Mode}`;
type Movies = `${Base}/movies`;
type Top = `${Base}/top/${AppEnums['topCategory']}`;

export const NAV = {
  oscars: {
    base: '/oscars',
    movies: '/oscars/movies',
    top: {
      actor: '/oscars/top/actor',
      cinematographer: '/oscars/top/cinematographer',
      director: '/oscars/top/director',
      producer: '/oscars/top/producer',
      writer: '/oscars/top/writer',
    },
  },
  rewa: {
    base: '/rewa',
    movies: '/rewa/movies',
    top: {
      actor: '/rewa/top/actor',
      cinematographer: '/rewa/top/cinematographer',
      director: '/rewa/top/director',
      producer: '/rewa/top/producer',
      writer: '/rewa/top/writer',
    },
  },
} satisfies {
  [k in Mode]: {
    base: Base;
    movies: Movies;
    top: Record<AppEnums['topCategory'], Top>;
  };
};
