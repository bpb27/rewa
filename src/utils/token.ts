import { Movie } from "~/pages/tables/movies";

export type TokenType =
  | "director"
  | "actor"
  | "year"
  | "host"
  | "streamer"
  | "genre"
  | "movie"
  | "runtime"
  | "budget"
  | "revenue";

type BaseToken = { id: number; name: string; type: TokenType };

export type Token<TObject extends BaseToken = BaseToken> = TObject;

const utils = {
  add: (tokens: Token[], token: Token) => {
    return [...tokens, token];
  },
  alreadyPresent: (tokens: Token[], { id, type }: Token) => {
    return !!tokens.find(t => t.type === type && t.id === id);
  },
  byType: (tokens: Token[], type: TokenType) => {
    return tokens.filter(t => t.type === type);
  },
  ids: (tokens: Token[]) => {
    return tokens.map(t => t.id);
  },
  matches: (tokens: Token[], ids: number[]) => {
    return tokens.every(t => ids.includes(t.id));
  },
  remove: (tokens: Token[], { id, type }: Token) => {
    return tokens.filter(t => !(t.type === type && t.id === id));
  },
  within: (tokens: Token[], comp: number, range: number) => {
    return tokens.every(t => Math.abs(t.id - comp) <= range);
  },
};

const tenMil = 10000000;

const filterByToken = (tokens: Token[], movie: Movie) => {
  const { byType, ids, matches, within } = utils;
  if (!matches(byType(tokens, "director"), ids(movie.directors))) return false;
  if (!matches(byType(tokens, "streamer"), ids(movie.streamers))) return false;
  if (!matches(byType(tokens, "host"), ids(movie.hosts))) return false;
  if (!matches(byType(tokens, "genre"), ids(movie.genres))) return false;
  if (!matches(byType(tokens, "actor"), movie.actorIds)) return false; // full actor set (movie.actors just has top 3)
  if (!matches(byType(tokens, "movie"), [movie.id])) return false;
  if (!matches(byType(tokens, "year"), [movie.year.id])) return false;
  if (!within(byType(tokens, "runtime"), movie.runtime.id, 10)) return false; // within 10 mins
  if (!within(byType(tokens, "budget"), movie.budget.id, tenMil)) return false; // within $10 mil
  if (!within(byType(tokens, "revenue"), movie.revenue.id, tenMil)) return false; // within $10 mil
  return true;
};

const toggleToken = (tokens: Token[], token: Token) => {
  return tokenUtils.alreadyPresent(tokens, token)
    ? tokenUtils.remove(tokens, token)
    : tokenUtils.add(tokens, token);
};

export const tokenUtils = { ...utils, filter: filterByToken, toggle: toggleToken };
