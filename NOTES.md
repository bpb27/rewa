# TODO

images loaded via next/image use vercel's image optimization, which has hit it's limit and now they don't render:

- need to pass "unoptimized={true}"
- instead of original, use a smaller poster size
-

"poster_sizes": [
"w92",
"w154",
"w185",
"w342",
"w500",
"w780",
"original"
],
"profile_sizes": [
"w45",
"w185",
"h632",
"original"
],

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
