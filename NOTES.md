TODO

- hosting
- clear way to add a new movie + episode
- determine db or settle for JSON
- move tables to different dir
- table click on year, director, host, genre, production company? to create filter tokens
- watch providers API
- movie sidebar shows top 5 stars
- fill in missing budget data
- imdb rating / rotten t rating
- responsiveness
- academy awards stuff

top table - actors, directors, writers

- different routes w/ same page layout to take advantage of SSR

## Prisma Tips

- `npx prisma format` - format schema file
- `npx prisma db seed` - run seed file
- `npx prisma migrate dev` - run migration

use tmdb movie id
use credit_id for cast and crew
try a tiny batch (limit cast and crew to 5 or 10) - some are failing
try validating the payload before the create calls

Make a Rewatchables site

- tables: actors, directors, writers, movies, hosts - or cast
- sql lite?
- cool to have viz of highest frequency cast
- imdb + rotten tomatoes score

# Ideas

- probably just a table instead of chart
- use sqlite + prisma to store data + getServerSideProps to render

# IMDB list of all movies (is up to date)

https://www.imdb.com/list/ls099792855/?sort=list_order,desc&st_dt=&mode=detail&page=3

# API docs

https://developers.themoviedb.org/3/getting-started/introduction

# Requesting a movie by IMDB id

https://api.themoviedb.org/3/find/tt0124718?api_key=THE_KEY&language=en-US&external_source=imdb_id

# Requesting a movie an TMDB id

https://api.themoviedb.org/3/movie/550?api_key=THE_KEY&append_to_response=credits

Probably need to query and swap ids, then run the movie query.

# Showing an image file

https://image.tmdb.org/t/p/original/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg

The structure of the `/pages` directory determines the app routing.

- `/` => `/pages/index.tsx`
- `/posts/first` => `/pages/posts/first.tsx`

Use the `<Link/>` component from `next/link` to create links.
These use client-side (JS) routing.
Code is auto-split by pages, and any page links will prefetch in the background.

Use the `<Image/>` component from `next/image`.
Images should be stored in the `/public/images` directory.
Auto optimizes.
Lazy loaded when scrolled into viewport.
Avoids layout shift.

Use the `<Head/>` component for page titles and metadata and stuff.
Can probably use a layout component to avoid needing to add a head to every page.

Also a `<Script/>` component from `next/script`.
Use for third party stuff.

Two types of pre-rendering:

- static: generates HTML at build time, same stuff is reused on every request
- server-side: generates HTML on each request

NB: in dev mode static generation will be generated on each request
