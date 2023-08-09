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

export type TokenMode = "and" | "or";

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
  matches: (tokens: Token[], ids: number[], mode: TokenMode) => {
    const filter = mode === "or" ? "some" : "every";
    return !tokens.length || tokens[filter](t => ids.includes(t.id));
  },
  remove: (tokens: Token[], { id, type }: Token) => {
    return tokens.filter(t => !(t.type === type && t.id === id));
  },
  within: (tokens: Token[], comp: number, range: number, mode: TokenMode) => {
    const filter = mode === "or" ? "some" : "every";
    return !tokens.length || tokens[filter](t => Math.abs(t.id - comp) <= range);
  },
};

const tenMil = 10000000;

// TODO: when tokenMode === 'or', need to return true on ANY match
const filterByToken = (tokens: Token[], movie: Movie, mode: TokenMode = "or") => {
  const { byType, ids, matches, within } = utils;
  if (!matches(byType(tokens, "director"), ids(movie.directors), mode)) return false;
  if (!matches(byType(tokens, "streamer"), ids(movie.streamers), mode)) return false;
  if (!matches(byType(tokens, "host"), ids(movie.hosts), mode)) return false;
  if (!matches(byType(tokens, "genre"), ids(movie.genres), mode)) return false;
  if (!matches(byType(tokens, "actor"), movie.actorIds, mode)) return false; // full actor set (movie.actors just has top 3)
  if (!matches(byType(tokens, "movie"), [movie.id], mode)) return false;
  if (!matches(byType(tokens, "year"), [movie.year.id], mode)) return false;
  if (!within(byType(tokens, "runtime"), movie.runtime.id, 10, mode)) return false; // within 10 mins
  if (!within(byType(tokens, "budget"), movie.budget.id, tenMil, mode)) return false; // within $10 mil
  if (!within(byType(tokens, "revenue"), movie.revenue.id, tenMil, mode)) return false; // within $10 mil
  return true;
};

const toggleToken = (tokens: Token[], token: Token) => {
  return tokenUtils.alreadyPresent(tokens, token)
    ? tokenUtils.remove(tokens, token)
    : tokenUtils.add(tokens, token);
};

export const tokenUtils = { ...utils, filter: filterByToken, toggle: toggleToken };
