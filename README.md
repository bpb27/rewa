## Rewa

Explore movie data from The Oscars and The Rewatchables podcast

## Requirements

- NodeJS
- Postgres

## ENVs

- `touch ./.env.local`
- Add a `DATABASE_URL`
- Add a `TMDB_API_KEY`

## Running locally

1. `npm i`
2. `npm run dev`

## Deployments

Branches are auto-deployed via Vercel (production tracks main branch)

## Stack

Frontend: React, Next, xState, Radix, Tailwind
Backend: tRPC, Zod, Kysely, Postgres, Vercel

## Data

All data comes from the [TMDB](https://www.themoviedb.org/) API.

Oscars data comes from a [dataset](https://www.kaggle.com/datasets/unanimad/the-oscar-award) published by Raphael Fontes and has been programmatically matched to TMDB data (there may be a few incorrect links).
