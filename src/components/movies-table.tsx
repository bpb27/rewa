import * as Tooltip from '@radix-ui/react-tooltip';
import { useCallback, type PropsWithChildren } from 'react';
import { EbertLink, ImdbLink, SpotifyLink } from '~/components/external-links';
import { type MoviesPageMovie } from '~/components/movies-page';
import { Icon } from '~/components/ui/icons';
import { streamerShortName } from '~/data/streamers';
import { AppEnums } from '~/utils/enums';
import { capitalize, formatRuntime, moneyShort } from '~/utils/format';
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
  onTokenClick: (tokenType: AppEnums['token'], tokenId: number) => void;
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
              <MoviePoster title={m.name} image={m.image} variant="table" />
            </Table.Data>
            <Table.Data sticky>
              <Text bold onClick={() => onMovieTitleClick(m.id)}>
                {m.name}
              </Text>
            </Table.Data>
            <Table.Data>
              <Text noWrap onClick={() => onTokenClick('year', Number(m.year))}>
                {m.year}
              </Text>
            </Table.Data>
            <Table.Data>
              <Crate column>
                {m.crew
                  .filter(c => c.job === 'director')
                  .map(d => (
                    <Text noWrap key={d.id} onClick={() => onTokenClick('director', d.id)}>
                      {d.name}
                    </Text>
                  ))}
                <PopoverMenu content={<CrewPopover items={m.crew} onClick={onTokenClick} />}>
                  <Text secondary>Show crew</Text>
                </PopoverMenu>
              </Crate>
            </Table.Data>
            <Table.Data>
              <Crate column>
                {m.actors.map(a => (
                  <ImageTooltip key={a.id} path={a.image} name={a.name}>
                    <Text noWrap onClick={() => onTokenClick('actor', a.id)} tag="span">
                      {a.name}
                    </Text>
                  </ImageTooltip>
                ))}
              </Crate>
            </Table.Data>
            <Table.Data>
              <Crate column>
                <Text noWrap>{m.totalOscarNominations} noms</Text>
                <Text noWrap>{m.totalOscarWins} wins</Text>
                <Text
                  noWrap
                  hide={!m.totalOscarNominations}
                  onClick={() =>
                    onOscarYearClick({ movieId: m.id, year: m.oscars[0].ceremonyYear })
                  }
                  secondary
                >
                  Show
                </Text>
              </Crate>
            </Table.Data>
            {showHosts && m.episode && (
              <Table.Data>
                <Crate column>
                  {m.episode.hosts.slice(0, 3).map(h => (
                    <Text noWrap key={h.id} onClick={() => onTokenClick('host', h.id)}>
                      {h.name}
                    </Text>
                  ))}
                  {m.episode.hosts.length > 3 && (
                    <PopoverMenu
                      content={
                        <StandardPopover
                          items={m.episode.hosts}
                          onClick={id => onTokenClick('host', id)}
                        />
                      }
                    >
                      <Text noWrap secondary>
                        {m.episode.hosts.length - 3} more
                      </Text>
                    </PopoverMenu>
                  )}
                </Crate>
              </Table.Data>
            )}
            <Table.Data>
              <Text noWrap onClick={() => onTokenClick('budget', Number(m.budget))}>
                {moneyShort(Number(m.budget))}
              </Text>
            </Table.Data>
            <Table.Data>
              <Text noWrap onClick={() => onTokenClick('revenue', Number(m.revenue))}>
                {moneyShort(Number(m.revenue))}
              </Text>
            </Table.Data>
            <Table.Data>
              <Text noWrap onClick={() => onTokenClick('runtime', m.runtime)}>
                {formatRuntime(m.runtime)}
              </Text>
            </Table.Data>
            {showEbert && (
              <Table.Data>
                <StarRating value={m.ebert?.rating} />
              </Table.Data>
            )}
            <Table.Data>
              <Crate column>
                {m.keywords.slice(0, 3).map(k => (
                  <Text noWrap key={k.id} onClick={() => onTokenClick('keyword', k.id)}>
                    {k.name}
                  </Text>
                ))}
                {m.keywords.length > 3 && (
                  <PopoverMenu
                    content={
                      <StandardPopover
                        items={m.keywords}
                        onClick={id => onTokenClick('keyword', id)}
                      />
                    }
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
                  <Text noWrap key={s.id} onClick={() => onTokenClick('streamer', s.id)}>
                    {streamerShortName(s.name)}
                  </Text>
                ))}
              </Crate>
            </Table.Data>
            <Table.Data>
              <Crate column>
                <ImdbLink id={m.imdbId} className="text-blue-500 underline">
                  IMDB
                </ImdbLink>
                {!!m.episode && (
                  <SpotifyLink url={m.episode.spotifyUrl} className="text-blue-500 underline">
                    Spotify
                  </SpotifyLink>
                )}
                {!!m.ebert?.reviewUrl && (
                  <EbertLink path={m.ebert.reviewUrl} className="text-blue-500 underline">
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

const CrewPopover = ({
  items,
  onClick,
}: {
  items: { id: number; name: string; job: AppEnums['tokenCrew'] }[];
  onClick: (tokenType: AppEnums['token'], tokenId: number) => void;
}) => (
  <Crate column>
    {smartSort(items, i => i.job).map(c => (
      <Text noWrap key={c.id + c.job} onClick={() => onClick(c.job, c.id)}>
        <b>{capitalize(c.job)}:</b> {c.name}
      </Text>
    ))}
  </Crate>
);

const StandardPopover = ({
  items,
  onClick,
}: {
  items: { id: number; name: string }[];
  onClick: (id: number) => void;
}) => (
  <Crate column>
    {smartSort(items, t => t.name).map(t => (
      <Text noWrap key={t.id} onClick={() => onClick(t.id)}>
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
              <PersonPoster name={name} image={path} variant="tooltip" />
            </div>
            <Tooltip.Arrow className="fill-black" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
