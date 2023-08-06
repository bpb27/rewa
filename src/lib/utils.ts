import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface MarginProps {
  m?: MarginSize;
  mx?: MarginSize;
  my?: MarginSize;
  ml?: MarginSize;
  mr?: MarginSize;
  mt?: MarginSize;
  mb?: MarginSize;
}

export const margin = (props: Record<string, any>) => {
  const response = Object.keys(props)
    .filter((key) => ['m', 'mx', 'my', 'ml', 'mr', 'mt', 'mb'].includes(key))
    .reduce((className, key) => `${className} ${key}-${props[key]}`, '')
    .trim();
  console.log(response);
  return response;
};

type MarginSize = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type MarginDirection = 'x' | 'y' | 'l' | 'r' | 't' | 'b';
export type Margin =
  | `m-${MarginSize}`
  | `mx-${MarginSize}`
  | `my-${MarginSize}`
  | `ml-${MarginSize}`
  | `mr-${MarginSize}`
  | `mt-${MarginSize}`
  | `mb-${MarginSize}`;
