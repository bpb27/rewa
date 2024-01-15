import * as Tooltip from '@radix-ui/react-tooltip';
import Image from 'next/image';
import { Fragment, type PropsWithChildren } from 'react';
import { EbertLink, ImdbLink, SpotifyLink } from '~/components/external-links';
import { type MoviesPageMovie } from '~/components/movies-page';
import { Icon } from '~/components/ui/icons';
import { QpSchema, type SortKey } from '~/data/query-params';
import { streamerShortName } from '~/data/streamers';
import { type Token } from '~/data/tokens';
import { capitalize } from '~/utils/format';
import { smartSort } from '~/utils/sorting';
import { cn } from '~/utils/style';
import { MovieTablePoster, tmdbImage } from './images';
import { Crate } from './ui/box';
import { PopoverMenu } from './ui/popover';
import { StarRating } from './ui/stars';
import { Text } from './ui/text';

type MoviesTableProps = {
  mode: QpSchema['movieMode'];
  movies: MoviesPageMovie[];
  onSortClick: (sort: SortKey) => void;
  onTokenClick: (token: Token) => void;
  onOscarYearClick: (params: { movieId: number; year: number }) => void;
  onMovieTitleClick: (id: number) => void;
};

export const MoviesTable = ({
  mode,
  movies,
  onMovieTitleClick,
  onOscarYearClick,
  onSortClick,
  onTokenClick,
}: MoviesTableProps) => {
  const showHosts = mode === 'rewa';
  const showEbert = mode === 'rewa';
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-slate-200 bg-blue-100 text-left shadow-md [&>th]:whitespace-nowrap [&>th]:px-2 [&>th]:py-2">
            <th>Poster</th>
            <th
              onClick={() => onSortClick('title')}
              className="sticky left-0 cursor-pointer bg-gradient-to-r from-blue-100 from-90% to-blue-100/90"
            >
              Title
            </th>
            <th onClick={() => onSortClick('release_date')} className="cursor-pointer">
              Year
            </th>
            <th onClick={() => onSortClick('director')} className="cursor-pointer">
              Director
            </th>
            <th>Top Cast</th>
            <th>Oscars</th>
            {showHosts && <th>Hosts</th>}
            <th onClick={() => onSortClick('budget')} className="cursor-pointer">
              Budget
            </th>
            <th onClick={() => onSortClick('revenue')} className="cursor-pointer">
              Box Office
            </th>
            <th onClick={() => onSortClick('runtime')} className="cursor-pointer">
              Runtime
            </th>
            {showEbert && (
              <th onClick={() => onSortClick('ebert')} className="cursor-pointer">
                Our Guy
              </th>
            )}
            <th>Keywords</th>
            <th>Streaming</th>
            <th>
              <Crate>
                Links <Icon.Link className="ml-2" />
              </Crate>
            </th>
          </tr>
        </thead>
        <tbody>
          {movies.map(m => (
            <Fragment key={m.id}>
              {/* NB: can't add padding or margin to trs, or using empty row as a spacer */}
              <tr className="h-4"></tr>
              <tr className="rounded-xl border-2 border-slate-300 bg-slate-50 p-2 text-left shadow-md [&>td]:px-2">
                <td>
                  <MovieTablePoster title={m.title} poster_path={m.poster_path} />
                </td>
                <td className="sticky left-0 max-w-[250px] bg-gradient-to-r from-slate-50 from-90% to-slate-50/90 pl-3">
                  <Text bold onClick={() => onMovieTitleClick(m.id)}>
                    {m.title}
                  </Text>
                </td>
                <td>
                  <Text noWrap onClick={() => onTokenClick(m.year)}>
                    {m.year.name}
                  </Text>
                </td>
                <td>
                  <Crate column>
                    {m.directors.map(d => (
                      <Text noWrap key={d.id} onClick={() => onTokenClick(d)}>
                        {d.name}
                      </Text>
                    ))}
                    <PopoverMenu content={<CrewPopover tokens={m.crew} onClick={onTokenClick} />}>
                      <Text secondary>Show crew</Text>
                    </PopoverMenu>
                  </Crate>
                </td>
                <td>
                  <Crate column>
                    {m.actors.map(a => (
                      <ImageTooltip key={a.id} path={a.profile_path}>
                        <Text noWrap onClick={() => onTokenClick(a)} tag="span">
                          {a.name}
                        </Text>
                      </ImageTooltip>
                    ))}
                  </Crate>
                </td>
                <td>
                  <Crate column>
                    <Text>{m.oscars.noms} noms</Text>
                    <Text>{m.oscars.wins} wins</Text>
                    <Text
                      hide={!m.oscars.noms}
                      onClick={() => onOscarYearClick({ movieId: m.id, year: m.oscars.year })}
                      secondary
                    >
                      Show
                    </Text>
                  </Crate>
                </td>
                {showHosts && (
                  <td>
                    <Crate column>
                      {m.hosts.slice(0, 3).map(h => (
                        <Text noWrap key={h.id} onClick={() => onTokenClick(h)}>
                          {h.name}
                        </Text>
                      ))}
                      {m.hosts.length > 3 && (
                        <PopoverMenu
                          content={<StandardPopover tokens={m.hosts} onClick={onTokenClick} />}
                        >
                          <Text noWrap secondary>
                            {m.hosts.length - 3} more
                          </Text>
                        </PopoverMenu>
                      )}
                    </Crate>
                  </td>
                )}
                <td>
                  <Text onClick={() => onTokenClick(m.budget)}>{m.budget.name}</Text>
                </td>
                <td>
                  <Text onClick={() => onTokenClick(m.revenue)}>{m.revenue.name}</Text>
                </td>
                <td>
                  <Text onClick={() => onTokenClick(m.runtime)}>{m.runtime.name}</Text>
                </td>
                {showEbert && (
                  <td>
                    <StarRating value={m.ebertReview?.rating} />
                  </td>
                )}
                <td>
                  <Crate column>
                    {m.keywords.slice(0, 3).map(h => (
                      <Text noWrap key={h.id} onClick={() => onTokenClick(h)}>
                        {h.name}
                      </Text>
                    ))}
                    {m.keywords.length > 3 && (
                      <PopoverMenu
                        content={<StandardPopover tokens={m.keywords} onClick={onTokenClick} />}
                      >
                        <Text noWrap secondary>
                          {m.keywords.length - 3} more
                        </Text>
                      </PopoverMenu>
                    )}
                  </Crate>
                </td>

                <td>
                  <Crate column>
                    {m.streamers.map(s => (
                      <Text noWrap key={s.id} onClick={() => onTokenClick(s)}>
                        {streamerShortName(s.name)}
                      </Text>
                    ))}
                  </Crate>
                </td>

                <td>
                  <Crate column>
                    <ImdbLink id={m.imdb_id} className="text-blue-500 underline">
                      IMDB
                    </ImdbLink>
                    {!!m.episode && (
                      <SpotifyLink url={m.episode.spotify_url} className="text-blue-500 underline">
                        Spotify
                      </SpotifyLink>
                    )}
                    {!!m.ebertReview?.path && (
                      <EbertLink path={m.ebertReview.path} className="text-blue-500 underline">
                        Ebert
                      </EbertLink>
                    )}
                  </Crate>
                </td>
              </tr>
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

type PopoverProps = {
  tokens: Token[];
  onClick: MoviesTableProps['onTokenClick'];
};

const CrewPopover = ({ tokens, onClick }: PopoverProps) => (
  <Crate column>
    {tokens.map(c => (
      <Text noWrap key={c.id + c.type} onClick={() => onClick(c)}>
        <b>{capitalize(c.type)}:</b> {c.name}
      </Text>
    ))}
  </Crate>
);

const StandardPopover = ({ tokens, onClick }: PopoverProps) => (
  <Crate column>
    {smartSort(tokens, t => t.name).map(t => (
      <Text noWrap key={t.id} onClick={() => onClick(t)}>
        {t.name}
      </Text>
    ))}
  </Crate>
);

const ImageTooltip = ({
  alt,
  children,
  path,
}: PropsWithChildren<{ alt?: string; path: string | null }>) => {
  if (!path) return null;
  return (
    <Tooltip.Provider delayDuration={1200}>
      <Tooltip.Root>
        <Tooltip.Trigger>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content sideOffset={5}>
            <div className={cn('rounded border-2 border-slate-700 shadow-xl')}>
              <Image
                src={tmdbImage(path)}
                alt={alt ? `Image of ${alt}` : 'Person'}
                height={200}
                width={130}
              />
            </div>
            <Tooltip.Arrow className="fill-black" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
