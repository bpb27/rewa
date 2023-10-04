Rename to Leaderboard

# Bugs

- empty search results have an empty results w/ transparent background on mobile

# Data probs

- The Hunt is wrong (should be the Mads movie)
- Accented characters when searching
- Award category to separate table so it can be tokenized

# TODO

- clicking table title opens movie sidebar w/ more info
- oscar filters (button that opens an overlay)
  - filter bullshit awards checkbox (on by default)
  - every award checklist
  - won checkbox
  - year range (two inputs, gte and lte) (maybe same for budget, revenue, runtime)
- oscars by year page (would help verify data is right)
- displaying oscars in table
  - card and table display
  - normalize names
  - tokenize award id
  - ability to view oscar year (probably via modal)
- lots of oscar movie cards dont have taglines but do have overviews - need a way to access it
- maxlist box when lots of directors, hosts, oscars, genres
- more UI
  - year range selector
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
- basic smoke test
- type API route strings w/ responses, probably nav routes too
- top appearance since year
- more linting rules
- expandable place for description, crew, cast + load more in table
- imdb rating / rottenmater rating / roger ebert
- person most involved list
- ditch css modules
- search on top appearances pages
