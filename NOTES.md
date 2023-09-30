- oscar/rewa mode switch in navbar (green and gold)
- top appearances pages + api route filter
- lots of oscar movie cards dont have taglines but do have overviews - need a way to access it
- maxlist box when lots of directors, hosts, oscars, genres
- displaying oscars in table
  - card and table display
  - normalize names
  - tokenize award id
  - ability to view oscar year (probably via modal)
- more composable pieces in scripts - when you import stuff from other files they automatically run
- a11y
  - accessible button name
  - select label
  - make sure table is navigable
  - lots of clickable things - probably need to add role button + aria label
- more UI
  - clicking table title opens movie sidebar w/ more info
  - year range selector
  - handle oscar/rewa discrepancies (e.g. hosts, episode columns), sortable fields
  - maxwidth on TDs (cast, title, director)
- oscar streamers strategy
  - 3.9k movies
  - filter out movies w/ bullshit awards (doc short, animated short, e.g.)
- basic smoke test
- missing oscars

# NICE TO HAVE

- more linting rules
- expandable place for description, crew, cast + load more
- imdb rating / rottenmater rating
- filter components like year slider, host checklist/typeahead (or filter sidebar) (would be outside token bar but needs to be QP'd)
- person most involved list
- ditch css modules?
- actor viz sensor + search? search on other pages?

# IMDB list of all rewatchables movies

https://www.imdb.com/list/ls099792855/?sort=list_order,desc&st_dt=&mode=detail&page=3
