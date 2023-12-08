import { Fragment, ReactNode, type PropsWithChildren } from 'react';
import { noop } from 'remeda';
import { EbertLink, ImdbLink, SpotifyLink } from '~/components/external-links';
import { type MoviesPageMovie } from '~/components/movies-page';
import { Icon } from '~/components/ui/icons';
import { QpSchema, type SortKey } from '~/data/query-params';
import { streamerShortName } from '~/data/streamers';
import { type Token } from '~/data/tokens';
import { capitalize } from '~/utils/format';
import { smartSort } from '~/utils/sorting';
import { cn } from '~/utils/style';
import { MovieTablePoster } from './images';
import { PopoverMenu } from './ui/popover';
import { StarRating } from './ui/stars';
import { Text } from './ui/text';

type MovieTableProps = {
  mode: QpSchema['movieMode'];
  movies: MoviesPageMovie[];
  onSortClick: (sort: SortKey) => void;
  onTokenClick: (token: Token) => void;
  onOscarYearClick: (params: { movieId: number; year: number }) => void;
  onMovieTitleClick: (id: number) => void;
};

export const MovieTable = ({
  mode,
  movies,
  onMovieTitleClick,
  onOscarYearClick,
  onSortClick,
  onTokenClick,
}: MovieTableProps) => {
  const showHosts = mode === 'rewa';
  const showEbert = mode === 'rewa';
  const sort = (key: SortKey) => () => onSortClick(key);
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-slate-200 bg-blue-100 text-left shadow-md [&>th]:pr-2">
            <TableHeader>Poster</TableHeader>
            <TableHeader
              onClick={sort('title')}
              className="sticky left-0 bg-gradient-to-r from-blue-100 from-90% to-blue-100/90"
            >
              Title
            </TableHeader>
            <TableHeader onClick={sort('release_date')}>Year</TableHeader>
            <TableHeader onClick={sort('director')}>Director</TableHeader>
            <TableHeader>Top Cast</TableHeader>
            <TableHeader>Oscars</TableHeader>
            <TableHeader show={showHosts}>Hosts</TableHeader>
            <TableHeader onClick={sort('budget')}>Budget</TableHeader>
            <TableHeader onClick={sort('revenue')}>Box Office</TableHeader>
            <TableHeader onClick={sort('runtime')}>Runtime</TableHeader>
            <TableHeader onClick={sort('ebert')} show={showEbert}>
              Our Guy
            </TableHeader>
            <TableHeader>Keywords</TableHeader>
            <TableHeader>Streaming</TableHeader>
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
                <td>
                  <MovieTablePoster title={m.title} poster_path={m.poster_path} />
                </td>
                <td
                  className="sticky left-0 max-w-[250px] bg-gradient-to-r from-slate-50 from-90% to-slate-50/90 pl-3 font-bold text-slate-700"
                  onClick={() => onMovieTitleClick(m.id)}
                >
                  <span className="cursor-pointer hover:underline">{m.title}</span>
                </td>
                <ClickableTd tokens={[m.year]} onClick={onTokenClick} />
                <ClickableTd
                  tokens={m.crew}
                  onClick={onTokenClick}
                  max={1}
                  showMoreText={() => 'Show crew'}
                  sort={false}
                  popoverItemText={({ name, type }) => (
                    <span>
                      <b>{capitalize(type)}</b>: {name}
                    </span>
                  )}
                />
                <ClickableTd tokens={m.actors} onClick={onTokenClick} />
                <td>
                  <div className="flex flex-col">
                    <Text>{m.oscars.noms} noms</Text>
                    <Text>{m.oscars.wins} wins</Text>
                    {m.oscars.noms > 0 && (
                      <Text
                        secondary
                        onClick={() => onOscarYearClick({ movieId: m.id, year: m.oscars.year })}
                      >
                        Show
                      </Text>
                    )}
                  </div>
                </td>
                {showHosts && <ClickableTd tokens={m.hosts} onClick={onTokenClick} max={3} />}
                <ClickableTd tokens={[m.budget]} onClick={onTokenClick} />
                <ClickableTd tokens={[m.revenue]} onClick={onTokenClick} />
                <ClickableTd tokens={[m.runtime]} onClick={onTokenClick} />
                {showEbert && (
                  <td>
                    <StarRating value={m.ebertReview?.rating} />
                  </td>
                )}
                <ClickableTd tokens={m.keywords} onClick={onTokenClick} max={3} />
                <ClickableTd
                  tokens={m.streamers.map(s => ({ ...s, name: streamerShortName(s.name) }))}
                  onClick={onTokenClick}
                />
                <td>
                  <div className="flex flex-col">
                    {!!m.episode && (
                      <SpotifyLink url={m.episode.spotify_url} className="text-blue-500 underline">
                        Spotify
                      </SpotifyLink>
                    )}
                    <ImdbLink id={m.imdb_id} className="text-blue-500 underline">
                      IMDB
                    </ImdbLink>
                    {!!m.ebertReview?.path && (
                      <EbertLink path={m.ebertReview.path} className="text-blue-500 underline">
                        Ebert
                      </EbertLink>
                    )}
                  </div>
                </td>
              </tr>
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

type TableHeaderProps = PropsWithChildren<{
  className?: string;
  onClick?: () => void;
  show?: boolean;
}>;

const TableHeader = ({ className, children, onClick, show }: TableHeaderProps) => {
  return show === false ? null : (
    <th
      onClick={onClick || noop}
      className={cn(
        onClick ? 'cursor-pointer hover:underline' : undefined,
        'whitespace-nowrap px-2 py-3',
        className
      )}
    >
      {children}
    </th>
  );
};

type ClickableTdProps = {
  max?: number;
  onClick: (v: Token) => void;
  popoverItemText?: (token: Token) => ReactNode;
  showMoreText?: (remaining: number) => ReactNode;
  sort?: boolean;
  tokens: Token[];
};

const ClickableTd = ({
  max = 4,
  onClick,
  popoverItemText = token => token.name,
  showMoreText = remaining => `${remaining} more`,
  sort = true,
  tokens,
}: ClickableTdProps) => {
  const total = tokens.length;
  const needsPagination = total > max;
  const remaining = total - max;
  return (
    <td>
      {tokens.slice(0, max).map(token => (
        <ClickableField
          key={token.id}
          onClick={() => onClick(token)}
          text={() => token.name}
          {...token}
        />
      ))}
      {needsPagination && max < total && (
        <PopoverMenu
          trigger={
            <div className="cursor-pointer px-1 text-slate-500 hover:underline">
              {showMoreText(remaining)}
            </div>
          }
        >
          <div>
            {(sort ? smartSort([...tokens], t => t.name) : tokens).map(token => (
              <ClickableField
                key={token.id}
                onClick={() => onClick(token)}
                text={popoverItemText}
                {...token}
              />
            ))}
          </div>
        </PopoverMenu>
      )}
    </td>
  );
};

type ClickableFieldProps = {
  onClick: () => void;
  text: (token: Token) => ReactNode;
} & Token;

const ClickableField = ({ onClick, text, ...token }: ClickableFieldProps) => (
  <div
    className="max-w-[400px] cursor-pointer overflow-hidden overflow-ellipsis whitespace-nowrap px-1 hover:underline"
    key={token.id}
    onClick={onClick}
  >
    {text(token)}
  </div>
);
