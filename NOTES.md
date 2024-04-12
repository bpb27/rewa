# Bugs

text w/ onClick calls onClick twice

- getting unclear what is clickable and what the clicks will do
- need a clear "clicking this will filter" vs. "clicking this will open a modal" vs. "not clickable"

- Rewa move bar cast numbers don't seem to be accurate (Matt Damon Producer 2 on Machesty)
- Date console error on TopCategory movie sidebar
- ModalHistory seems to be dropping first one on top cat page
- getStaticProps will render old stuff if updating prod from script

# Potential TODOs

- need a better strategy for local and remote - ideally migration

- sidebars need titles

- store top movies + new table with top? - or can just query for top but would need to store tmdb vote

  - think about refreshing movies with all the extra data
  - some more interesting data in TMDB - popularity, vote_average, spoken_language, production countries - can get everything thru the movie endpoint (5k)

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
