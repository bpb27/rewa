import { type PropsWithChildren, Fragment } from 'react';
import { ImdbLink, SpotifyLink } from '~/components/external-links';
import { Icon } from '~/components/icons';
import { MovieTablePoster } from '~/components/images';
import { type Movie } from '~/components/movie-table-page';
import { type Token } from '~/data/tokens';
import { type SortKey } from '~/data/query-params';
import { cn } from '~/utils/style';

type MovieTableProps = {
  movies: Movie[];
  onSortClick: (sort: SortKey) => void;
  onTokenClick: (token: Token) => void;
};

export const MovieTable = ({ movies, onSortClick, onTokenClick }: MovieTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-slate-200 bg-blue-50 text-left shadow-md [&>th]:pr-2">
            <TableHeader>Poster</TableHeader>
            <TableHeader onSort={onSortClick} sort="title">
              Title
            </TableHeader>
            <TableHeader onSort={onSortClick} sort="release_date">
              Year
            </TableHeader>
            <TableHeader onSort={onSortClick} sort="director">
              Director
            </TableHeader>
            <TableHeader>Top Cast</TableHeader>
            <TableHeader>Hosts</TableHeader>
            <TableHeader>Streaming</TableHeader>
            <TableHeader onSort={onSortClick} sort="budget">
              Budget
            </TableHeader>
            <TableHeader onSort={onSortClick} sort="revenue" className="min-w-[90px]">
              Box Office
            </TableHeader>
            <TableHeader onSort={onSortClick} sort="runtime">
              Runtime
            </TableHeader>
            <TableHeader>Genres</TableHeader>
            <TableHeader>
              <div className="flex">
                Links
                <Icon.Link className="ml-2" />
              </div>
            </TableHeader>
          </tr>
        </thead>
        <tbody>
          {movies.map(m => (
            <Fragment key={m.id}>
              {/* NB: can't add padding or margin to trs, or using empty row as a spacer */}
              <tr className="h-4"></tr>
              <tr className="rounded-xl border-2 border-slate-300 bg-slate-50 p-2 text-left shadow-md">
                <td className="p-2">
                  <MovieTablePoster title={m.title} poster_path={m.poster_path} />
                </td>
                <td className="max-w-[200px] pl-3 font-bold text-slate-700">{m.title}</td>
                <ClickableTd tokens={[m.year]} onClick={onTokenClick} />
                <ClickableTd tokens={m.directors} onClick={onTokenClick} />
                <ClickableTd tokens={m.actors} onClick={onTokenClick} />
                <ClickableTd tokens={m.hosts} onClick={onTokenClick} />
                <ClickableTd tokens={m.streamers} onClick={onTokenClick} />
                <ClickableTd tokens={[m.budget]} onClick={onTokenClick} />
                <ClickableTd tokens={[m.revenue]} onClick={onTokenClick} />
                <ClickableTd tokens={[m.runtime]} onClick={onTokenClick} />
                <ClickableTd tokens={m.genres} onClick={onTokenClick} />
                <td>
                  <ImdbLink id={m.imdb_id}>IMDB</ImdbLink>
                  <br />
                  <SpotifyLink url={m.episode.spotify_url}>Spotify</SpotifyLink>
                </td>
              </tr>
            </Fragment>
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

const ClickableTd = ({ onClick, tokens }: ClickableTdProps) => (
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

type THProps = PropsWithChildren<{
  sort?: SortKey;
  onSort?: (prop: SortKey) => void;
  className?: string;
}>;

const TableHeader = ({ className, children, onSort, sort }: THProps) => (
  <th
    onClick={() => onSort && sort && onSort(sort)}
    className={cn(
      sort ? 'cursor-pointer hover:underline' : undefined,
      'whitespace-nowrap px-2 py-3',
      className
    )}
  >
    {children}
  </th>
);
