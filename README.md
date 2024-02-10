## Rewa

Explore movie data from The Oscars and The Rewatchables podcast

## Running locally

1. `npm i`
2. `npm run dev`

## Deployments

Branches are auto-deployed via Vercel (production tracks main branch)

## Stack

React, Next, Radix, Tailwind, XState, Zod, Prisma, TRPC, SQLite, Vercel

## Data

All data comes from the [TMDB](https://www.themoviedb.org/) API.

Oscars data comes from a [dataset](https://www.kaggle.com/datasets/unanimad/the-oscar-award) published by Raphael Fontes and has been programmatically parsed to link it to TMDB data (there may be a few incorrect links).

This site's Oscar data is freely available in JSON [here](https://github.com/bpb27/rewa/blob/main/sql/oscars.json), and contains TMDB and IMDB ids for each award (plus actor TMDB ids for acting awards and director TMDB ids for directing awards). You can extract additional data from the [sqlite database](https://github.com/bpb27/rewa/blob/main/prisma/db.sqlite).
