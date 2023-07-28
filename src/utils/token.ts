import { getYear, moneyShort } from '~/utils';

export type TokenType =
  | 'director'
  | 'actor'
  | 'year'
  | 'host'
  | 'streamer'
  | 'genre'
  | 'movie'
  | 'runtime'
  | 'budget'
  | 'revenue';

type NumberToken = Extract<TokenType, 'runtime' | 'budget' | 'revenue'>;

type BaseToken = { id: number; name: string; type: TokenType };

export type Token<TObject extends BaseToken = BaseToken> = TObject;

export const removeToken = (tokens: Token[], { id, type }: Token) =>
  tokens.filter((t) => !(t.type === type && t.id === id));

export const hasToken = (tokens: Token[], { id, type }: Token) =>
  !!tokens.find((t) => t.type === type && t.id === id);

export const yearTokenPayload = (date: string): Token => {
  const year = date.length === 4 ? date : getYear(date);
  return { id: Number(year), name: String(year), type: 'year' };
};

export const revenueTokenPayload = (revenue: number): Token => {
  return {
    id: revenue * 1000,
    name: `${moneyShort(revenue * 1000)}`,
    type: 'revenue',
  };
};

export const budgetTokenPayload = (budget: number): Token => {
  return {
    id: budget,
    name: `${moneyShort(budget)}`,
    type: 'budget',
  };
};
export const runtimeTokenPayload = (runtime: number): Token => {
  return {
    id: runtime,
    name: `${runtime} mins`,
    type: 'runtime',
  };
};

export const tokenPayload = (
  data:
    | { type: NumberToken; value: number }
    | { type: 'year'; value: string }
    | {
        type: Exclude<TokenType, NumberToken | 'year'>;
        value: string;
        id: number;
      }
): BaseToken => {
  switch (data.type) {
    case 'budget': {
      return {
        id: data.value,
        name: `${moneyShort(data.value)}`,
        type: data.type,
      };
    }
    case 'revenue': {
      return {
        id: data.value * 1000,
        name: `${moneyShort(data.value * 1000)}`,
        type: data.type,
      };
    }
    case 'runtime': {
      return {
        id: data.value,
        name: `${data.value} mins`,
        type: data.type,
      };
    }
    case 'year': {
      return {
        id: Number(getYear(data.value)),
        name: getYear(data.value),
        type: data.type,
      };
    }
    default: {
      return {
        id: data.id,
        name: data.value,
        type: data.type,
      };
    }
  }
};
