import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// enable vscode intellisense w/ https://github.com/tailwindlabs/tailwindcss/issues/7553#issuecomment-735915659
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
