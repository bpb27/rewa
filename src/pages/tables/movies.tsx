import { Icon } from "~/components/icons";
import Layout from "~/components/layout";
import { useEffect, useMemo, useRef, useState } from "react";
import { getYear, moneyShort, smartSort } from "~/utils";
import { pick } from "remeda";
import { StaticProps } from "~/types";
import { FullTypeahead } from "~/components/full-typeahead";
import { Prisma } from "~/prisma";
import { MovieCards } from "~/components/movie-card";
import { useVizSensor } from "~/utils/use-viz-sensor";
import { sortingUtils, type SortProp } from "~/utils/sorting";
import { tokenUtils, Token, TokenMode } from "~/utils/token";
import { MovieTable } from "~/components/movie-table";
import { Button } from "~/components/ui/button";
import { Select } from "~/components/ui/select";

const prisma = Prisma.getPrisma();
const selectIdAndName = { select: { id: true, name: true } };

export const getStaticProps = async () => {
  const data = await prisma.movies.findMany({
    select: {
      budget: true,
      id: true,
      imdb_id: true,
      poster_path: true,
      release_date: true,
      revenue: true, // NB: stored in DB as / 1000 due to BigInt shit
      runtime: true,
      title: true,
      tagline: true,
      actors_on_movies: {
        orderBy: { credit_order: "asc" },
        select: { actors: selectIdAndName },
      },
      crew_on_movies: {
        where: { job: "Director" },
        select: {
          job: true,
          crew: selectIdAndName,
        },
      },
      episodes: {
        select: {
          id: true,
          spotify_url: true,
          episode_order: true,
          hosts_on_episodes: { select: { hosts: selectIdAndName } },
        },
      },
      genres_on_movies: {
        select: { genres: selectIdAndName },
      },
      streamers_on_movies: {
        select: { streamers: selectIdAndName },
      },
    },
  });

  const movies = data.map(movie => {
    const episode = movie.episodes[0];

    const actors = movie.actors_on_movies
      .filter(jt => jt.actors)
      .map(jt => jt.actors!)
      .map(item => ({ ...item, type: "actor" } satisfies Token));

    const hosts = episode.hosts_on_episodes
      .filter(jt => jt.hosts)
      .map(jt => jt.hosts!)
      .map(item => ({ ...item, type: "host" } satisfies Token));

    const directors = movie.crew_on_movies
      .filter(jt => jt.job === "Director")
      .map(jt => jt.crew!)
      .map(item => ({ ...item, type: "director" } satisfies Token));

    const genres = movie.genres_on_movies
      .filter(jt => jt.genres)
      .map(jt => jt.genres!)
      .map(item => ({ ...item, type: "genre" } satisfies Token));

    const streamers = movie.streamers_on_movies
      .filter(jt => jt.streamers)
      .map(jt => jt.streamers!)
      .map(item => ({ ...item, type: "streamer" } satisfies Token));

    const budget = {
      id: movie.budget,
      name: moneyShort(movie.budget),
      type: "budget",
    } satisfies Token;

    const revenue = {
      id: movie.revenue * 1000,
      name: moneyShort(movie.revenue * 1000),
      type: "revenue",
    } satisfies Token;

    const runtime = {
      id: movie.runtime,
      name: `${movie.runtime} mins`,
      type: "runtime",
    } satisfies Token;

    const year = {
      id: Number(getYear(movie.release_date)),
      name: getYear(movie.release_date),
      type: "year",
    } satisfies Token;

    return {
      ...pick(movie, ["id", "imdb_id", "poster_path", "release_date", "tagline", "title"]),
      episode: pick(episode, ["episode_order", "id", "spotify_url"]),
      actors: actors.slice(0, 3),
      actorIds: actors.map(a => a.id),
      budget,
      directors,
      genres,
      hosts,
      revenue,
      runtime,
      streamers,
      year,
    };
  });

  return {
    props: { movies },
  };
};

type MoviesProps = StaticProps<typeof getStaticProps>;
export type Movie = MoviesProps["movies"][number];

export default function Movies({ movies }: MoviesProps) {
  const [asc, setAsc] = useState(false);
  const [rowNumber, setRowNumber] = useState(20);
  const [tokenMode, setTokenMode] = useState<TokenMode>("or");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [orderBy, setOrderBy] = useState<SortProp>("episodeNumber");
  const [displayType, setDisplayType] = useState<"table" | "card">("table");
  const vizSensorRef = useRef<HTMLDivElement>(null);

  const movieList = useMemo(() => {
    const filtered = movies.filter(movie => tokenUtils.filter(tokens, movie, tokenMode));
    const sorted = smartSort([...filtered], sortingUtils.fns[orderBy], asc);
    return sorted;
  }, [asc, movies, orderBy, tokens, tokenMode]);

  useVizSensor(vizSensorRef, {
    rootMargin: "200px",
    threshold: 0.1,
    callback: () => {
      setRowNumber(rowNumber + 20);
    },
  });

  useEffect(() => {
    setRowNumber(20); // reset on search or filter
  }, [movieList.length]);

  const toggleToken = (newToken: Token) => {
    setTokens(tokenUtils.toggle(tokens, newToken));
  };

  const displayedMovies = movieList.slice(0, rowNumber);
  return (
    <Layout title="All movies">
      <div className="mb-1 mt-3 flex flex-col py-2">
        <FullTypeahead onSelect={item => toggleToken(item)} />
        <div className="mt-1 flex space-x-2 overflow-scroll">
          {tokens.length > 0 && (
            <Button onClick={() => setTokens([])} variant="token">
              <Icon.Close className="mr-2" />
              Clear ({tokens.length})
            </Button>
          )}
          {tokens.length > 1 && (
            <Button
              className="flex"
              variant="token"
              onClick={() => setTokenMode(tokenMode === "and" ? "or" : "and")}
            >
              <Icon.Filter className="mr-2" />
              {tokenMode === "and" ? "And" : "Or"}
            </Button>
          )}
          {tokens.map(token => (
            <Button
              key={`${token.id}-${token.type}`}
              onClick={() => toggleToken(token)}
              variant="token"
            >
              {token.name}
            </Button>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-center">
          <h2 className="mr-3 flex items-center text-xl font-semibold tracking-wide">
            {movieList.length} <Icon.Movie className="ml-1" />
          </h2>
          <Select
            onSelect={value => setOrderBy(value as SortProp)}
            options={sortingUtils.options}
            value={orderBy}
          />
          <Button className="ml-1 mr-3" onClick={() => setAsc(!asc)} variant="icon">
            {asc ? <Icon.ArrowUp /> : <Icon.ArrowDown />}
          </Button>
          <Button
            className="ml-3"
            onClick={() => setDisplayType("table")}
            selected={displayType === "table"}
            variant="icon"
          >
            <Icon.Table />
          </Button>
          <Button
            onClick={() => setDisplayType("card")}
            selected={displayType === "card"}
            variant="icon"
          >
            <Icon.Card />
          </Button>
        </div>
      </div>
      {displayType === "table" ? (
        <MovieTable movies={displayedMovies} onTokenClick={toggleToken} />
      ) : (
        <MovieCards movies={displayedMovies} onTokenClick={toggleToken} />
      )}
      <div ref={vizSensorRef} />
    </Layout>
  );
}
