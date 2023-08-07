import { Movie } from "~/pages/tables/movies";
import { Icon } from "./icons";
import { MovieTablePoster } from "./images";
import { Token } from "~/utils/token";
import { ImdbLink, SpotifyLink } from "./external-links";
import { cn } from "~/lib/utils";

type MovieTableProps = {
  movies: Movie[];
  onTokenClick: (token: Token) => void;
};

export const MovieTable = ({ movies, onTokenClick }: MovieTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left [&>th]:pr-2">
            <th>Poster</th>
            <th>Title</th>
            <th>Year</th>
            <th>Director</th>
            <th>Top Cast</th>
            <th>Hosts</th>
            <th>Streaming</th>
            <th className="min-w-[90px]">Box Office</th>
            <th>Budget</th>
            <th>Runtime</th>
            <th>Genres</th>
            <th>
              <div className="flex">
                Links
                <Icon.Link className="ml-2" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {movies.map((m, i) => (
            <tr
              key={m.id}
              className={cn((i + 1) % 2 && "bg-slate-100", "border-t-2 border-slate-200 text-left")}
            >
              <td>
                <MovieTablePoster title={m.title} poster_path={m.poster_path} />
              </td>
              <td className="max-w-[200px] pl-3 font-bold text-slate-700">{m.title}</td>
              <ClickableTd tokens={[m.year]} onClick={onTokenClick} />
              <ClickableTd tokens={m.directors} onClick={onTokenClick} />
              <ClickableTd tokens={m.actors} onClick={onTokenClick} />
              <ClickableTd tokens={m.hosts} onClick={onTokenClick} />
              <ClickableTd tokens={m.streamers} onClick={onTokenClick} />
              <ClickableTd tokens={[m.revenue]} onClick={onTokenClick} />
              <ClickableTd tokens={[m.budget]} onClick={onTokenClick} />
              <ClickableTd tokens={[m.runtime]} onClick={onTokenClick} />
              <ClickableTd tokens={m.genres} onClick={onTokenClick} />
              <td>
                <ImdbLink id={m.imdb_id}>IMDB</ImdbLink>
                <br />
                <SpotifyLink url={m.episode.spotify_url}>Spotify</SpotifyLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

type ClickableTdProps = {
  onClick: (v: Token) => void;
  tokens: Token[];
};

const ClickableTd = ({ onClick, tokens }: ClickableTdProps) => {
  return (
    <td>
      {tokens.map(item => (
        <div
          className="cursor-pointer px-1 hover:underline"
          key={item.name}
          onClick={() => onClick(item)}
        >
          {item.name}
        </div>
      ))}
    </td>
  );
};
