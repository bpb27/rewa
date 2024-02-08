# VSCode

- copy line down: shift + option + down
- multiline cursor on selection: shift + option + i

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

top category should sort ties by lowest cumulative credit order

add more view fields

- isRewa
- isOscar
- isActorNominated
- isDirectorNominated
- rename to movies_view

- implement filters on top page (ready to go, just need to figure out how to present)

- try trpcServerSide helpers thing

- movieMode === 'oscar' but route === 'oscars'

- may be time to switch to postgres
- git warnings about 50mb file size, plus it has load in all serverless functions
- free hobby PG via vercel, or can look for other cheap options
- could use prisma accelerate and use edge functions

- try out other ORMs

- look for name extraction lib to get oscar links for writers and others

- table element text should be selectable for easy copy/pasting

- since DB is read-only at production time, the file can be bundled w/ deployments
- so deploying to multiple regions for edge functions should be fast
- currently only in west coast though - look into vercel pricing for multi-region

- migrations?

- actors table?

- search probs with accented characters - probably store normalized string alongside actual

- oscars year should be table
- can take a year range
- movie | award | won | recipient
- also be cool to have top movies of that year by popularity / revenue / tmdb avg (can be a dynamic call)

- trpc caching (https://vercel.com/docs/edge-network/caching#how-to-cache-responses)

- add more streamer options (Criterion, Tubi)

- more crate and text

- look into suspense for modals + sidebars + dialogs that are loading?

- title in table has extra padding that overlaps table border

- tooltips and popovers should be centered aligned to content

- streamer update strategy (ideally once a week cron)

- a11y
- accessible button name
- select label
- make sure table is navigable

- basic smoke test

- ditch css modules
