# Potential TODOs

- sort options in cast overlay

- table sidebars need to be more clickable

- link to IMDB/TMDB (they did all the work)

- search overlay option: oscar ceremony year

- preview deployments are running migrations on prod db

- new movies in migrations
  - script that fetches from the API
  - checks for existing records and
  -
- just put the params in there and call the script?
- or get the JSON from TMDB and then put it in a file
- could make a "new-movie-migration" script to generate the boilerplate

- some more interesting data in TMDB - popularity, vote_average, spoken_language, production countries - can get everything thru the movie endpoint (5k)

- about w/ a google form or link to github to open an issue

- mix genres into keywords

- route with /field/subfield - should be able to just make a [...field] directory

- oscar actor leaderboard supporting/lead toggle

- make oscar modal movie titles clickable, bring up spotlight
- can't have two modals open at once
- would be nice to have a back button

- movieMode === 'oscar' but route === 'oscars'

- search probs with accented characters - coould store normalized string alongside actual, or see if there's a pg solution

- top movies of that year by popularity / revenue / tmdb avg (can be a dynamic call)

- trpc caching (https://vercel.com/docs/edge-network/caching#how-to-cache-responses)

- add more streamer options (Criterion, Tubi)

- streamer update strategy (ideally once a week cron)

- a11y
- accessible button name
- select label
- make sure table is navigable

- basic smoke test

- ditch css modules
