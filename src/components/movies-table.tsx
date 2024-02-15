import * as Tooltip from '@radix-ui/react-tooltip';
import { useCallback, type PropsWithChildren } from 'react';
import { EbertLink, ImdbLink, SpotifyLink } from '~/components/external-links';
import { type MoviesPageMovie } from '~/components/movies-page';
import { Icon } from '~/components/ui/icons';
import { streamerShortName } from '~/data/streamers';
import { type Token } from '~/data/tokens';
import { AppEnums } from '~/utils/enums';
import { capitalize } from '~/utils/format';
import { smartSort } from '~/utils/sorting';
import { MoviePoster, PersonPoster } from './images';
import { Crate } from './ui/box';
import { PopoverMenu } from './ui/popover';
import { StarRating } from './ui/stars';
import { Table } from './ui/table';
import { Text } from './ui/text';

type MoviesTableProps = {
  mode: AppEnums['movieMode'];
  movies: MoviesPageMovie[];
  onSortClick: (sort: AppEnums['sort']) => void;
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
  const handleHeaderClick = useCallback(
    (sortKey: AppEnums['sort']) => () => onSortClick(sortKey),
    [onSortClick]
  );
  return (
    <Table>
      <Table.Head>
        <Table.Header>Poster</Table.Header>
        <Table.Header onClick={handleHeaderClick('title')} sticky>
          Title
        </Table.Header>
        <Table.Header onClick={handleHeaderClick('release_date')}>Year</Table.Header>
        <Table.Header>Director</Table.Header>
        <Table.Header>Top Cast</Table.Header>
        <Table.Header>Oscars</Table.Header>
        {showHosts && <Table.Header>Hosts</Table.Header>}
        <Table.Header onClick={handleHeaderClick('budget')}>Budget</Table.Header>
        <Table.Header onClick={handleHeaderClick('revenue')}>Box Office</Table.Header>
        <Table.Header onClick={handleHeaderClick('runtime')}>Runtime</Table.Header>
        {showEbert && <Table.Header onClick={handleHeaderClick('ebert')}>Our Guy</Table.Header>}
        <Table.Header>Keywords</Table.Header>
        <Table.Header>Streaming</Table.Header>
        <Table.Header>
          <Crate>
            Links <Icon.Link className="ml-2" />
          </Crate>
        </Table.Header>
      </Table.Head>
      <Table.Body>
        {movies.map(m => (
          <Table.Row key={m.id}>
            <Table.Data className="p-0">
              <MoviePoster title={m.title} poster_path={m.poster_path} variant="table" />
            </Table.Data>
            <Table.Data sticky>
              <Text bold onClick={() => onMovieTitleClick(m.id)}>
                {m.title}
              </Text>
            </Table.Data>
            <Table.Data>
              <Text noWrap onClick={() => onTokenClick(m.year)}>
                {m.year.name}
              </Text>
            </Table.Data>
            <Table.Data>
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
            </Table.Data>
            <Table.Data>
              <Crate column>
                {m.actors.map(a => (
                  <ImageTooltip key={a.id} path={a.profile_path} name={a.name}>
                    <Text noWrap onClick={() => onTokenClick(a)} tag="span">
                      {a.name}
                    </Text>
                  </ImageTooltip>
                ))}
              </Crate>
            </Table.Data>
            <Table.Data>
              <Crate column>
                <Text noWrap>{m.oscars.noms} noms</Text>
                <Text noWrap>{m.oscars.wins} wins</Text>
                <Text
                  noWrap
                  hide={!m.oscars.noms}
                  onClick={() => onOscarYearClick({ movieId: m.id, year: m.oscars.year })}
                  secondary
                >
                  Show
                </Text>
              </Crate>
            </Table.Data>
            {showHosts && (
              <Table.Data>
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
              </Table.Data>
            )}
            <Table.Data>
              <Text noWrap onClick={() => onTokenClick(m.budget)}>
                {m.budget.name}
              </Text>
            </Table.Data>
            <Table.Data>
              <Text noWrap onClick={() => onTokenClick(m.revenue)}>
                {m.revenue.name}
              </Text>
            </Table.Data>
            <Table.Data>
              <Text noWrap onClick={() => onTokenClick(m.runtime)}>
                {m.runtime.name}
              </Text>
            </Table.Data>
            {showEbert && (
              <Table.Data>
                <StarRating value={m.ebertReview?.rating} />
              </Table.Data>
            )}
            <Table.Data>
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
            </Table.Data>
            <Table.Data>
              <Crate column>
                {m.streamers.map(s => (
                  <Text noWrap key={s.id} onClick={() => onTokenClick(s)}>
                    {streamerShortName(s.name)}
                  </Text>
                ))}
              </Crate>
            </Table.Data>
            <Table.Data>
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
            </Table.Data>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
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
  name,
  children,
  path,
}: PropsWithChildren<{ name: string; path: string | null }>) => {
  if (!path) return null;
  return (
    <Tooltip.Provider delayDuration={1200}>
      <Tooltip.Root>
        <Tooltip.Trigger>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content sideOffset={5}>
            <div className="rounded shadow-xl">
              <PersonPoster name={name} poster_path={path} variant="tooltip" />
            </div>
            <Tooltip.Arrow className="fill-black" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
