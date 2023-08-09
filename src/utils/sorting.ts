import { type Movie } from "~/pages/tables/movies";

export type SortProp = keyof typeof sortFns;

const sortFns = Object.freeze({
  budget: (m: Movie) => m.budget.id,
  director: (m: Movie) => m.directors[0]?.name,
  episodeNumber: (m: Movie) => m.episode.episode_order,
  profit: (m: Movie) => {
    const budget = m.budget.id;
    const revenue = m.revenue.id;
    if (!budget || !revenue) return 0;
    return (revenue - budget) / budget;
  },
  release_date: (m: Movie) => m.release_date,
  revenue: (m: Movie) => m.revenue.id,
  runtime: (m: Movie) => m.runtime.id,
  title: (m: Movie) => m.title,
} satisfies { [k: string]: (m: Movie) => string | number });

const sortOptions = [
  { value: "title", label: "Title" },
  { value: "release_date", label: "Year" },
  { value: "episodeNumber", label: "Episode" },
  { value: "runtime", label: "Runtime" },
  { value: "revenue", label: "Box Office" },
  { value: "budget", label: "Budget" },
  { value: "profit", label: "Profit %" },
  { value: "director", label: "Director" },
] satisfies { value: SortProp; label: string }[];

export const sortingUtils = { options: sortOptions, fns: sortFns };
