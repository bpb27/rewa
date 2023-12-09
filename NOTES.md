# Latest

- proper caching https://vercel.com/docs/edge-network/caching#how-to-cache-responses
- could use in more places
- look into suspense for modals + sidebars + dialogs that are loading?

- leaderboard hover should show title somewhere (maybe make posters a little bigger)
- year gte lte, maybe budget revenue runtime also
- maybe remove the movie card view and always show table
- title search should replace rather than add
- actor hover show pic in popover (after delay though or it will be annoying)

# Data probs

- The Hunt is wrong (should be the Mads movie)
- Accented characters when searching

# TODO

- budget, revenue, runtime range?
- lots of oscar movie cards dont have taglines but do have overviews - need a way to access it
- oscar streamers strategy
  - 3.9k movies
  - filter out movies w/ bullshit awards (doc short, animated short, e.g.)
- a11y
  - accessible button name
  - select label
  - make sure table is navigable
  - lots of clickable things - probably need to add role button + aria label
- TS navigation links
- basic smoke test
- top appearance since year
- more linting rules
- imdb rating / rottenmater rating
- person most involved list
- ditch css modules
- search on top appearances pages
