export type Prettify<T> = {
  [K in keyof T]: T[K];
} & unknown;

export type ValueOf<T> = T[keyof T];
