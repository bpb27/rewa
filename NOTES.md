# NBs

- getStaticProps will render old stuff if updating prod from script, so better to always add via migration
- preview deployments are running migrations on prod db

# Bugs

- text w/ onClick calls onClick twice

  - getting unclear what is clickable and what the clicks will do
  - need a clear "clicking this will filter" vs. "clicking this will open a modal" vs. "not clickable"

- Rewa move bar cast numbers don't seem to be accurate (Matt Damon Producer 2 on Machesty)
- Date console error on TopCategory movie sidebar
- ModalHistory seems to be dropping first one on top cat page

# Potential TODOs

- You shall use the TMDB logo to identify your use of the TMDB APIs. You shall place the following notice prominently on your application: "This product uses the TMDB API but is not endorsed or certified by TMDB." Any use of the TMDB logo in your application shall be less prominent than the logo or mark that primarily describes the application and your use of the TMDB logo shall not imply any endorsement by TMDB. When attributing TMDB, the attribution must be within your application's "About" or "Credits" type section.

- https://marcjschmidt.de/semantic-search

- store top movies - fetch for each year and store (need each variation), then can just query by sorting on revenue, tmdb vote, popularity, etc.

- sidebars need titles

- sort options in cast overlay

- table sidebars need to be more clickable

- link to IMDB/TMDB (they did all the work)

- search overlay option: oscar ceremony year

- about w/ a google form or link to github to open an issue

- mix genres into keywords

- route with /field/subfield - should be able to just make a [...field] directory

- oscar actor leaderboard supporting/lead toggle

- make oscar modal movie titles clickable, bring up spotlight

- movieMode === 'oscar' but route === 'oscars'

- search probs with accented characters - coould store normalized string alongside actual, or see if there's a pg solution

- trpc caching (https://vercel.com/docs/edge-network/caching#how-to-cache-responses)

- add more streamer options (Criterion, Tubi)

- streamer update strategy (ideally once a week cron)

- a11y

  - accessible button name
  - select label
  - make sure table is navigable

- basic smoke test

- ditch css modules
