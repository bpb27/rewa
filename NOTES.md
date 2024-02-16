# feature shit

- try kysely + turso + cloudflare
- 855 jobs for 200k crew_on_movies, make into it's own table, drop index

- show crew should be a modal w/ image name role, ideally clickable
- similar for show case

- route with /field/subfield - should be able to just make a [...field] directory

- oscar actor leaderboard supporting/lead toggle

- make oscar modal title clickable, bring up spotlight
- can't have two modals open at once
- would be nice to have a back button

- movieMode === 'oscar' but route === 'oscars'

- standalone node server - cold start times aren't great, response time even in the same AZ is not super fast

- search probs with accented characters - probably store normalized string alongside actual

- top movies of that year by popularity / revenue / tmdb avg (can be a dynamic call)

- trpc caching (https://vercel.com/docs/edge-network/caching#how-to-cache-responses)

- add more streamer options (Criterion, Tubi)

- streamer update strategy (ideally once a week cron)

- a11y
- accessible button name
- select label
- make sure table is navigable

## tech shit todo

- basic smoke test

- ditch css modules

- migrations

- may be time to switch to postgres
- git warnings about 50mb file size, plus it has load in all serverless functions
- free hobby PG via vercel, or can look for other cheap options
- could use prisma accelerate and use edge functions

- try out other ORMs

- more table views - isRewa, isOscar, hasActingOscar, hasDirectorOscar

## Add a new table

- add SQL to create-tables.ts script
- create a node script to run it (can use connectToDb + createTable utils)
- copy the movies_with_computed_fields view in the prisma schema and paste somewhere for reference
- run `npx prisma db pull`
- paste the view back into the schema (prisma changes stuff to unsupported, unclear how to avoid)
- run `npx prisma generate`
- you should be able to access it via normal prisma client calls
