# How To

## Add a new table

- add SQL to create-tables.ts script
- create a node script to run it (can use connectToDb + createTable utils)
- copy the movies_with_computed_fields view in the prisma schema and paste somewhere for reference
- run `npx prisma db pull`
- paste the view back into the schema (prisma changes stuff to unsupported, unclear how to avoid)
- run `npx prisma generate`
- you should be able to access it via normal prisma client calls

# TODO

- migrations?

- link oscars w/ actors and crew
- should make an actors_on_oscars and crew_on_oscars table
- many crew involved in oscars - would be good to normalize those recipients - comma or pipe separated, no additional words
- have already fixed all actors and directors names, so should be easy to look those up

- searching for short title, e.g. "red"
- need to return exact matches first (also show year in movie dropdown)

- oscars year should be table
  - can take a year range
  - movie | award | won | recipient
  - also be cool to have top movies of that year by popularity / revenue / tmdb avg (can be a dynamic call)
- trpc caching (https://vercel.com/docs/edge-network/caching#how-to-cache-responses)
- add more streamer options (Criterion, Tubi)
- xstate update to v5
- more crate and text
- look into suspense for modals + sidebars + dialogs that are loading?
- leaderboard hover show title and year in tooltip
- figure out image console warning
- title in table has extra padding that overlaps table border
- tooltips and popovers should be centered aligned to content
- streamer update strategy (ideally once a week cron)
- a11y
  - accessible button name
  - select label
  - make sure table is navigable
- route types
- basic smoke test
- ditch css modules
