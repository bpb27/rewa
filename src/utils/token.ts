import { isBoolean } from "remeda";
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
  groupByType: (tokens: Token[]) => {
    return {
      director: tokens.filter(t => t.type === "director"),
      streamer: tokens.filter(t => t.type === "streamer"),
      host: tokens.filter(t => t.type === "host"),
      genre: tokens.filter(t => t.type === "genre"),
      actor: tokens.filter(t => t.type === "actor"),
      movie: tokens.filter(t => t.type === "movie"),
      year: tokens.filter(t => t.type === "year"),
      runtime: tokens.filter(t => t.type === "runtime"),
      budget: tokens.filter(t => t.type === "budget"),
      revenue: tokens.filter(t => t.type === "revenue"),
      totalTokens: tokens.length,
    };
  },
  ids: (tokens: Token[]) => {
    return tokens.map(t => t.id);
  },
  matches: (tokens: Token[], ids: number[], mode: TokenMode) => {
    const filter = mode === "or" ? "some" : "every";
    return tokens[filter](t => ids.includes(t.id));
  },
  remove: (tokens: Token[], { id, type }: Token) => {
    return tokens.filter(t => !(t.type === type && t.id === id));
  },
  within: (tokens: Token[], comp: number, range: number, mode: TokenMode) => {
    const filter = mode === "or" ? "some" : "every";
    return tokens[filter](t => Math.abs(t.id - comp) <= range);
  },
};

const tenMil = 10000000;

const filterByToken = (
  t: ReturnType<(typeof utils)["groupByType"]>,
  movie: Movie,
  mode: TokenMode = "or"
) => {
  const { ids, matches, within } = utils;
  if (t.totalTokens === 0) return true;
  const results = [
    t.director.length && matches(t.director, ids(movie.directors), mode),
    t.streamer.length && matches(t.streamer, ids(movie.streamers), mode),
    t.host.length && matches(t.host, ids(movie.hosts), mode),
    t.genre.length && matches(t.genre, ids(movie.genres), mode),
    t.actor.length && matches(t.actor, movie.actorIds, mode), // full actor set (movie.actors just has top 3)
    t.movie.length && matches(t.movie, [movie.id], mode),
    t.year.length && matches(t.year, [movie.year.id], mode),
    t.runtime.length && within(t.runtime, movie.runtime.id, 10, mode), // within 10 mins
    t.budget.length && within(t.budget, movie.budget.id, tenMil, mode), // within $10 mil
    t.revenue.length && within(t.revenue, movie.budget.id, tenMil, mode), // within $10 mil
  ].filter(isBoolean);

  return mode == "or" ? results.some(r => r) : results.every(r => r);
};

const toggleToken = (tokens: Token[], token: Token) => {
  return tokenUtils.alreadyPresent(tokens, token)
    ? tokenUtils.remove(tokens, token)
    : tokenUtils.add(tokens, token);
};

export const tokenUtils = { ...utils, filter: filterByToken, toggle: toggleToken };
