import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type MarginSize = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type Margin =
  | `m-${MarginSize}`
  | `mx-${MarginSize}`
  | `my-${MarginSize}`
  | `ml-${MarginSize}`
  | `mr-${MarginSize}`
  | `mt-${MarginSize}`
  | `mb-${MarginSize}`;
