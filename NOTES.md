# Bugs

- page QP will fuckup shareable links
- empty search results have an empty results w/ transparent background on mobile
- clicking year range token (might be better to have separate qps - still technically lists so its easily tokenized though) - and just use inputs rather than slider
- old year range persisting in dialog after tokens cleared

# Minor UI

- searching for title, selecting, searching for another, selecting - results will always be empty (two title tokens) - should probably replace / only allow one

# Data probs

- The Hunt is wrong (should be the Mads movie)
- Accented characters when searching

# TODO

- oscars modal - could also take a movie id - clicking in table would open modal w/ movie's oscars + the whole year below
- clicking table title opens movie sidebar w/ more info
- budget, revenue, runtime range?
- oscars by year page (would help verify data is right)
- lots of oscar movie cards dont have taglines but do have overviews - need a way to access it
- maxlist box when lots of directors, hosts, oscars, genres
- more UI
  - handle oscar/rewa discrepancies (e.g. hosts, episode columns), sortable fields
  - maxwidth on TDs (cast, title, director)
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
- expandable place for description, crew, cast + load more in table
- imdb rating / rottenmater rating / roger ebert
- person most involved list
- ditch css modules
- search on top appearances pages
