## Rewa

Explore movie data from The Oscars and The Rewatchables podcast

## Running locally

NB: You'll need to have Postgres locally installed and running with a DB called "rewa".

1. `npm i`
2. `npm run dev`

## Deployments

Branches are auto-deployed via Vercel (production tracks main branch)

## Stack

Frontend: React, Next, Radix, XState, Zod, Tailwind
Backend: Next, TRPC, Kysely, Postgres, Vercel

## Data

All data comes from the [TMDB](https://www.themoviedb.org/) API.

Oscars data comes from a [dataset](https://www.kaggle.com/datasets/unanimad/the-oscar-award) published by Raphael Fontes and has been programmatically parsed to link it to TMDB data (there may be a few incorrect links).
