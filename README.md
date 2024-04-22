## Rewa

Explore movie data from The Oscars and The Rewatchables podcast

## Requirements

- NodeJS
- Postgres

## ENVs

- `touch ./.env.local`
- Add a `DATABASE_URL` (create a DB locally)
- Add a `TMDB_API_KEY` (create an account and get a key)
- `npm run db:migrate`

## Running locally

1. `npm i`
2. `npm run dev`

## Deployment

Branches are auto-deployed via Vercel (production tracks main branch)

## Stack

Frontend: React, Next, xState, Radix, Tailwind
Backend: tRPC, Zod, Kysely, Postgres, Vercel

## Data

All data comes from the [TMDB](https://www.themoviedb.org/) API.

Oscars data comes from a [dataset](https://www.kaggle.com/datasets/unanimad/the-oscar-award) published by Raphael Fontes and has been programmatically matched to TMDB data (there may be a few incorrect links).
