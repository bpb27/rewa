# NBs

- getStaticProps will render old stuff if updating prod from script, so better to always add via migration
- preview deployments are running migrations on prod db

# Potential TODOs

- better to define all token stuff in a single place - lot of files to jump through
- lean toward single exports w/ autocomplete

- try jobId:crewId query param instead of specific categories

- mix genres into keywords

- more clarity on what is clickable, and what will filter vs. open a modal

- You shall use the TMDB logo to identify your use of the TMDB APIs. You shall place the following notice prominently on your application: "This product uses the TMDB API but is not endorsed or certified by TMDB." Any use of the TMDB logo in your application shall be less prominent than the logo or mark that primarily describes the application and your use of the TMDB logo shall not imply any endorsement by TMDB. When attributing TMDB, the attribution must be within your application's "About" or "Credits" type section.

- https://marcjschmidt.de/semantic-search

- no revenue in top movies of the year is bad
- tricky because storage is almost out, would take 2k movies to track
- no API endpoint to fetch multiple movies
- could store limited set in table

- sidebars need titles

- filter overlay kinda sucks, hard to click on mobile

- table sidebars need to be more clickable

- link to IMDB/TMDB (they did all the work)

- search overlay option: oscar ceremony year

- about w/ a google form or link to github to open an issue

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
